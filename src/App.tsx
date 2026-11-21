import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { CheckCircle2 } from 'lucide-react';
import {
  HERO_SLIDES,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_RIDERS,
  INITIAL_RIDER_APPLICATIONS,
} from './data/catalog';
import {
  ADMIN_EMAIL,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  CartItem,
  CategoryFilter,
  CategoryItem,
  City,
  CustomerUser,
  MainGroup,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Rider,
  RiderApplication,
} from './types';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CatalogSection } from './components/CatalogSection';
import { CustomOrderSection } from './components/CustomOrderSection';
import { RiderSection } from './components/RiderSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CustomerLoginModal } from './components/CustomerLoginModal';
import { AdminModal } from './components/AdminModal';
import { AdminPage } from './components/AdminPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function sanitizeId(prefix: string, raw: string): string {
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  return `${prefix}-${slug || 'item'}-${Date.now().toString(36)}`;
}

function GTServiceApp() {
  const [selectedCity, setSelectedCity] = useState<City>('Khanewal');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeMainGroup, setActiveMainGroup] = useState<MainGroup>('All');

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStored('gt_orders', INITIAL_ORDERS)
  );
  const [riderApplications, setRiderApplications] = useState<RiderApplication[]>(() =>
    loadStored('gt_rider_apps', INITIAL_RIDER_APPLICATIONS)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStored('gt_cart', [])
  );
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() =>
    loadStored('gt_customer', null)
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [demoAdminAuth, setDemoAdminAuth] = useState(() =>
    loadStored('gt_admin_demo', false)
  );
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const seededRef = useRef(false);

  const isCloudAdmin = Boolean(
    firebaseUser?.emailVerified &&
      firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
  const isAdminAuthenticated = isCloudAdmin || demoAdminAuth;

  useEffect(() => {
    localStorage.setItem('gt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gt_customer', JSON.stringify(customerUser));
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem('gt_admin_demo', JSON.stringify(demoAdminAuth));
  }, [demoAdminAuth]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (user && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setCustomerUser((prev) => ({
          uid: user.uid,
          name: user.displayName || prev?.name || user.email?.split('@')[0] || 'Customer',
          email: user.email || undefined,
          phone: prev?.phone || '0300-0000000',
          city: prev?.city || selectedCity,
        }));
      }
    });
    return () => unsub();
  }, []);

  // Auto-seed initial catalog/categories/riders to Firestore on first Cloud Admin login
  useEffect(() => {
    if (!isCloudAdmin || seededRef.current) return;
    seededRef.current = true;

    const seedDefaultsIfEmpty = async () => {
      try {
        const [catSnap, prodSnap, riderSnap] = await Promise.all([
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'riders')),
        ]);

        if (catSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_CATEGORIES.forEach((cat) => {
            batch.set(doc(db, 'categories', cat.id), {
              id: cat.id,
              name: cat.name,
              mainGroup: cat.mainGroup,
              iconKey: cat.iconKey,
              createdAt: serverTimestamp(),
            });
          });
          await batch.commit();
        }

        if (prodSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach((prod) => {
            const payload: Record<string, unknown> = {
              id: prod.id,
              name: prod.name.slice(0, 120),
              price: prod.price,
              vendor: prod.vendor.slice(0, 100),
              deliveryTime: prod.deliveryTime.slice(0, 40),
              category: prod.category.slice(0, 50),
              mainGroup: prod.mainGroup,
              rating: prod.rating,
              visualType: prod.visualType,
              description: prod.description.slice(0, 300),
              inStock: prod.inStock,
              createdAt: serverTimestamp(),
            };
            if (prod.tag) payload.tag = prod.tag.slice(0, 40);
            if (prod.image) payload.image = prod.image.slice(0, 500);
            batch.set(doc(db, 'products', prod.id), payload);
          });
          await batch.commit();
        }

        if (riderSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_RIDERS.forEach((r) => {
            batch.set(doc(db, 'riders', r.id), {
              id: r.id,
              name: r.name,
              vehicle: r.vehicle,
              city: r.city,
              rating: r.rating,
              trips: r.trips,
              createdAt: serverTimestamp(),
            });
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('Seed check error:', err);
      }
    };

    seedDefaultsIfEmpty();
  }, [isCloudAdmin]);

  // Public real-time Firestore listeners (Categories, Products, Riders) — visible to ALL visitors!
  useEffect(() => {
    const catQuery = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubCats = onSnapshot(
      catQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCats = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: String(data.id || d.id),
              name: String(data.name || ''),
              mainGroup: (data.mainGroup as Exclude<MainGroup, 'All'>) || 'Food',
              iconKey: data.iconKey || 'tag',
            } as CategoryItem;
          });
          setCategories(cloudCats);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories');
      }
    );

    const prodQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubProds = onSnapshot(
      prodQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProds = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: String(data.id || d.id),
              name: String(data.name || ''),
              price: Number(data.price || 0),
              vendor: String(data.vendor || ''),
              deliveryTime: String(data.deliveryTime || '25-35 min'),
              category: String(data.category || 'General'),
              mainGroup: (data.mainGroup as Exclude<MainGroup, 'All'>) || 'Food',
              rating: Number(data.rating || 4.8),
              tag: data.tag ? String(data.tag) : undefined,
              image: data.image ? String(data.image) : undefined,
              visualType: data.visualType || 'image',
              description: String(data.description || ''),
              inStock: data.inStock !== false,
            } as Product;
          });
          setProducts(cloudProds);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    const riderQuery = query(collection(db, 'riders'), orderBy('createdAt', 'desc'));
    const unsubRiders = onSnapshot(
      riderQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudRiders = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: String(data.id || d.id),
              name: String(data.name || ''),
              vehicle: data.vehicle || 'Bike',
              city: data.city || 'Khanewal',
              rating: Number(data.rating || 4.8),
              trips: Number(data.trips || 0),
            } as Rider;
          });
          setRiders(cloudRiders);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'riders');
      }
    );

    return () => {
      unsubCats();
      unsubProds();
      unsubRiders();
    };
  }, []);

  // Protected Orders & Rider Applications listeners (only when authenticated)
  useEffect(() => {
    if (!authReady || !firebaseUser?.emailVerified) return;

    const ordersQuery = isCloudAdmin
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'orders'),
          where('userId', '==', firebaseUser.uid),
          orderBy('createdAt', 'desc')
        );

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const cloudOrders = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            userId: data.userId ? String(data.userId) : undefined,
            customerName: String(data.customerName || ''),
            phone: String(data.phone || ''),
            city: (data.city as City) || 'Khanewal',
            address: String(data.address || ''),
            paymentMethod: data.paymentMethod || 'Cash on Delivery',
            items: [],
            itemsSummary: String(data.itemsSummary || ''),
            subtotal: Number(data.subtotal || 0),
            deliveryFee: Number(data.deliveryFee || 0),
            total: Number(data.total || 0),
            hasCustomItems: Boolean(data.hasCustomItems),
            status: (data.status as OrderStatus) || 'Pending',
            createdAt: String(data.createdAtLabel || 'Just now'),
          } as Order;
        });
        setOrders(cloudOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    const appsQuery = isCloudAdmin
      ? query(collection(db, 'riderApplications'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'riderApplications'),
          where('userId', '==', firebaseUser.uid),
          orderBy('createdAt', 'desc')
        );

    const unsubApps = onSnapshot(
      appsQuery,
      (snapshot) => {
        const cloudApps = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            userId: data.userId ? String(data.userId) : undefined,
            fullName: String(data.fullName || ''),
            phone: String(data.phone || ''),
            vehicle: data.vehicle || 'Bike',
            city: (data.city as City) || 'Khanewal',
            cnic: String(data.cnic || ''),
            status: data.status || 'Pending',
            submittedAt: String(data.submittedAt || 'Just now'),
          } as RiderApplication;
        });
        setRiderApplications(cloudApps);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'riderApplications');
      }
    );

    return () => {
      unsubOrders();
      unsubApps();
    };
  }, [authReady, firebaseUser, isCloudAdmin]);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          vendor: product.vendor,
          image: product.image,
          visualType: product.visualType,
        },
      ];
    });
    showToast(`${product.name} cart me add ho gaya`);
  };

  const handleOrderSlide = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      handleAddToCart(product);
      setCartOpen(true);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCustomItem = (name: string, quantity: number, note: string) => {
    const customId = `custom-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        id: customId,
        name,
        price: null,
        quantity,
        vendor: 'Custom Shop Errand',
        isCustom: true,
        note: note || 'Price confirm before dispatch',
      },
    ]);
    showToast(`${name} custom item cart me add ho gaya`);
  };

  const handlePlaceOrder = (details: {
    customerName: string;
    phone: string;
    city: City;
    address: string;
    paymentMethod: PaymentMethod;
  }): Order => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
    const hasCustomItems = cartItems.some((i) => i.isCustom);
    const deliveryFee = subtotal >= 1000 ? 0 : 80;
    const orderId = `GT-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = cartItems
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(', ')
      .slice(0, 500);

    const newOrder: Order = {
      id: orderId,
      userId: firebaseUser?.uid,
      customerName: details.customerName,
      phone: details.phone,
      city: details.city,
      address: details.address,
      paymentMethod: details.paymentMethod,
      items: cartItems,
      itemsSummary,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      hasCustomItems,
      status: 'Pending',
      createdAt: 'Just now',
    };

    if (firebaseUser?.emailVerified) {
      const path = `orders/${orderId}`;
      setDoc(doc(db, 'orders', orderId), {
        id: orderId,
        userId: firebaseUser.uid,
        customerName: details.customerName.slice(0, 80),
        phone: details.phone.slice(0, 24),
        city: details.city,
        address: details.address.slice(0, 250),
        paymentMethod: details.paymentMethod,
        itemsSummary: itemsSummary || 'Order item',
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        hasCustomItems,
        status: 'Pending',
        createdAtLabel: 'Just now',
        createdAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, path));
    } else {
      setOrders((prev) => [newOrder, ...prev]);
    }

    setCartItems([]);
    return newOrder;
  };

  const handleSubmitRiderApplication = (
    app: Omit<RiderApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const appId = `app-${Date.now()}`;
    const newApp: RiderApplication = {
      ...app,
      id: appId,
      userId: firebaseUser?.uid,
      status: 'Pending',
      submittedAt: 'Just now',
    };

    if (firebaseUser?.emailVerified) {
      const path = `riderApplications/${appId}`;
      setDoc(doc(db, 'riderApplications', appId), {
        id: appId,
        userId: firebaseUser.uid,
        fullName: app.fullName.slice(0, 80),
        phone: app.phone.slice(0, 24),
        vehicle: app.vehicle,
        city: app.city,
        cnic: app.cnic.slice(0, 24),
        status: 'Pending',
        submittedAt: 'Just now',
        createdAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, path));
    } else {
      setRiderApplications((prev) => [newApp, ...prev]);
    }

    showToast('Rider application submit ho gayi!');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (isCloudAdmin) {
      const path = `orders/${orderId}`;
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    }
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  const handleRiderDecision = async (appId: string, decision: 'Approved' | 'Rejected') => {
    const target = riderApplications.find((a) => a.id === appId);
    if (isCloudAdmin) {
      const path = `riderApplications/${appId}`;
      try {
        await updateDoc(doc(db, 'riderApplications', appId), { status: decision });
        if (decision === 'Approved' && target) {
          const riderId = sanitizeId('rider', target.fullName);
          await setDoc(doc(db, 'riders', riderId), {
            id: riderId,
            name: target.fullName.slice(0, 80),
            vehicle: target.vehicle,
            city: target.city,
            rating: 5.0,
            trips: 1,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      setRiderApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: decision } : a))
      );
      if (decision === 'Approved' && target) {
        const newRider: Rider = {
          id: `rider-${Date.now()}`,
          name: target.fullName,
          vehicle: target.vehicle,
          city: target.city,
          rating: 5.0,
          trips: 1,
        };
        setRiders((prev) => [newRider, ...prev]);
      }
    }
    if (decision === 'Approved' && target) {
      showToast(`${target.fullName} active riders me add ho gaye`);
    }
  };

  const handleAddCategory = async (category: Omit<CategoryItem, 'id'>) => {
    const catId = sanitizeId('cat', category.name);
    const cleanCat: CategoryItem = {
      id: catId,
      name: category.name.slice(0, 50),
      mainGroup: category.mainGroup,
      iconKey: category.iconKey,
    };

    if (isCloudAdmin) {
      const path = `categories/${catId}`;
      try {
        await setDoc(doc(db, 'categories', catId), {
          ...cleanCat,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    } else {
      setCategories((prev) => [...prev, cleanCat]);
    }
    showToast(`Category "${cleanCat.name}" add ho gayi`);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (isCloudAdmin) {
      const path = `categories/${categoryId}`;
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }
    showToast('Category delete ho gayi');
  };

  const handleToggleProductStock = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    if (isCloudAdmin) {
      const path = `products/${productId}`;
      try {
        await updateDoc(doc(db, 'products', productId), {
          inStock: !target.inStock,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
      );
    }
  };

  const handleUpdateProductPrice = async (productId: string, price: number) => {
    if (isCloudAdmin) {
      const path = `products/${productId}`;
      try {
        await updateDoc(doc(db, 'products', productId), { price });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price } : p))
      );
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (isCloudAdmin) {
      const path = `products/${productId}`;
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
    showToast('Item catalog se delete ho gaya');
  };

  const handleAddProduct = async (
    product: Omit<Product, 'id' | 'rating' | 'visualType' | 'inStock'>
  ) => {
    const prodId = sanitizeId('prod', product.name);
    const hasCustomImage = Boolean(product.image && product.image.trim().length > 0);
    const visualType = hasCustomImage
      ? 'image'
      : product.mainGroup === 'Medicine'
      ? 'medicine-panadol'
      : product.mainGroup === 'Grocery'
      ? 'grocery-rice'
      : 'image';
    const fallbackFoodImage =
      !hasCustomImage && product.mainGroup === 'Food'
        ? '/src/assets/images/hero_chicken_biryani_1795257929188.jpg'
        : product.image;

    const newItem: Product = {
      ...product,
      id: prodId,
      name: product.name.slice(0, 120),
      vendor: product.vendor.slice(0, 100),
      deliveryTime: product.deliveryTime.slice(0, 40),
      category: product.category.slice(0, 50),
      description: product.description.slice(0, 300),
      rating: 4.8,
      visualType,
      image: fallbackFoodImage,
      inStock: true,
    };

    if (isCloudAdmin) {
      const path = `products/${prodId}`;
      const payload: Record<string, unknown> = {
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        vendor: newItem.vendor,
        deliveryTime: newItem.deliveryTime,
        category: newItem.category,
        mainGroup: newItem.mainGroup,
        rating: newItem.rating,
        visualType: newItem.visualType,
        description: newItem.description,
        inStock: newItem.inStock,
        createdAt: serverTimestamp(),
      };
      if (newItem.tag) payload.tag = newItem.tag.slice(0, 40);
      if (newItem.image) payload.image = newItem.image.slice(0, 500);

      try {
        await setDoc(doc(db, 'products', prodId), payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    } else {
      setProducts((prev) => [newItem, ...prev]);
    }
    showToast(`${newItem.name} storefront me add ho gaya`);
  };

  const handleConnectCloudAdmin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setDemoAdminAuth(false);
        showToast('Live Firebase Cloud Sync connect ho gaya!');
      } else {
        showToast(`Cloud Admin ke liye ${ADMIN_EMAIL} se sign in karain`);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Google sign-in cancel ho gaya');
    }
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdminLoginOpen(true);
    }
  };

  const scrollToRider = () => {
    document.getElementById('rider-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveMainGroup('All');
    setSearchQuery('');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (viewMode === 'admin' && isAdminAuthenticated) {
    return (
      <>
        <AdminPage
          isCloudSynced={isCloudAdmin}
          onConnectCloud={handleConnectCloudAdmin}
          orders={orders}
          riders={riders}
          riderApplications={riderApplications}
          categories={categories}
          products={products}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onHandleRiderApplication={handleRiderDecision}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onToggleProductStock={handleToggleProductStock}
          onUpdateProductPrice={handleUpdateProductPrice}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={handleAddProduct}
          onBackToStorefront={() => {
            setViewMode('storefront');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={async () => {
            setDemoAdminAuth(false);
            if (isCloudAdmin) {
              await signOut(auth);
            }
            setViewMode('storefront');
            showToast('Admin logout ho gaya');
          }}
        />
        {toastMsg && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
        onScrollToRider={scrollToRider}
        customerUser={customerUser}
      />

      <main className="flex-1">
        <HeroCarousel
          slides={HERO_SLIDES}
          selectedCity={selectedCity}
          onOrderSlide={handleOrderSlide}
        />

        <CatalogSection
          categories={categories}
          products={products}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activeMainGroup={activeMainGroup}
          onSelectMainGroup={setActiveMainGroup}
          onClearFilters={clearFilters}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <CustomOrderSection onAddCustomItem={handleAddCustomItem} />

        <RiderSection
          riders={riders}
          onSubmitApplication={handleSubmitRiderApplication}
        />
      </main>

      <Footer
        onSelectGroup={(group) => {
          setActiveCategory('All');
          setActiveMainGroup(group);
        }}
        onScrollToRider={scrollToRider}
        onOpenAdmin={handleOpenAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        selectedCity={selectedCity}
        customerUser={customerUser}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      <CustomerLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        selectedCity={selectedCity}
        customerUser={customerUser}
        orders={orders}
        onLogin={(user) => {
          setCustomerUser(user);
          showToast(`Khush aamdeed, ${user.name}!`);
        }}
        onLogout={() => {
          setCustomerUser(null);
          showToast('Aap logout ho gaye hain');
        }}
      />

      <AdminModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={(mode) => {
          if (mode === 'demo') {
            setDemoAdminAuth(true);
          }
          setAdminLoginOpen(false);
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Lightweight Toast Feedback */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GTServiceApp />
    </ErrorBoundary>
  );
}
