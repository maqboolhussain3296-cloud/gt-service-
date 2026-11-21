import React, { useState } from 'react';
import {
  ArrowLeft,
  Bike,
  Check,
  Cloud,
  CloudOff,
  FolderTree,
  LogOut,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  CategoryIconKey,
  CategoryItem,
  City,
  MainGroup,
  Order,
  OrderStatus,
  Product,
  Rider,
  RiderApplication,
} from '../types';
import { GTLogo } from './GTLogo';

interface AdminPageProps {
  isCloudSynced: boolean;
  onConnectCloud: () => void;
  orders: Order[];
  riders: Rider[];
  riderApplications: RiderApplication[];
  categories: CategoryItem[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onHandleRiderApplication: (appId: string, decision: 'Approved' | 'Rejected') => void;
  onAddCategory: (category: Omit<CategoryItem, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleProductStock: (productId: string) => void;
  onUpdateProductPrice: (productId: string, price: number) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'visualType' | 'inStock'>) => void;
  onBackToStorefront: () => void;
  onLogout: () => void;
}

type AdminSection = 'orders' | 'riders' | 'categories' | 'catalog';

const ICON_OPTIONS: { value: CategoryIconKey; label: string }[] = [
  { value: 'biryani', label: 'Desi / Biryani' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'burger', label: 'Burger / Fast Food' },
  { value: 'shawarma', label: 'Rolls / Shawarma' },
  { value: 'chinese', label: 'Chinese / Soup' },
  { value: 'desserts', label: 'Bakery / Desserts' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'fruits', label: 'Fruits & Veg' },
  { value: 'tag', label: 'General Tag' },
];

export const AdminPage: React.FC<AdminPageProps> = ({
  isCloudSynced,
  onConnectCloud,
  orders,
  riders,
  riderApplications,
  categories,
  products,
  onUpdateOrderStatus,
  onHandleRiderApplication,
  onAddCategory,
  onDeleteCategory,
  onToggleProductStock,
  onUpdateProductPrice,
  onDeleteProduct,
  onAddProduct,
  onBackToStorefront,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('catalog');

  // Orders filtering
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [orderCityFilter, setOrderCityFilter] = useState<'All' | City>('All');

  // Add Category form
  const [catName, setCatName] = useState('');
  const [catGroup, setCatGroup] = useState<Exclude<MainGroup, 'All'>>('Food');
  const [catIcon, setCatIcon] = useState<CategoryIconKey>('tag');

  // Catalog filtering & Add Product form
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogGroupFilter, setCatalogGroupFilter] = useState<MainGroup>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newGroup, setNewGroup] = useState<Exclude<MainGroup, 'All'>>('Food');
  const [newCategory, setNewCategory] = useState<string>(categories[0]?.name || 'Biryani');
  const [newTag, setNewTag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const pendingRiderCount = riderApplications.filter((a) => a.status === 'Pending').length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesCity = orderCityFilter === 'All' || order.city === orderCityFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      order.address.toLowerCase().includes(q);
    return matchesStatus && matchesCity && matchesQuery;
  });

  const filteredProducts = products.filter((p) => {
    const matchesGroup = catalogGroupFilter === 'All' || p.mainGroup === catalogGroupFilter;
    const q = catalogSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesGroup && matchesQuery;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    onAddCategory({
      name: catName.trim(),
      mainGroup: catGroup,
      iconKey: catIcon,
    });
    setCatName('');
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(newPrice);
    if (!newName.trim() || !numericPrice || numericPrice <= 0) return;
    onAddProduct({
      name: newName.trim(),
      price: numericPrice,
      vendor: newVendor.trim() || 'GT Service Partner',
      deliveryTime: '25-35 min',
      category: newCategory || categories[0]?.name || 'General',
      mainGroup: newGroup,
      tag: newTag.trim() || undefined,
      image: newImageUrl.trim() || undefined,
      description: newDescription.trim() || 'Freshly added via GT Service Admin Console.',
    });
    setNewName('');
    setNewPrice('');
    setNewVendor('');
    setNewTag('');
    setNewImageUrl('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const sectionTitle =
    activeSection === 'orders'
      ? 'Orders Management'
      : activeSection === 'riders'
      ? 'Riders & Applications'
      : activeSection === 'categories'
      ? 'Categories Management'
      : 'Menu & Stock Catalog';

  const getStatusBadgeClasses = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'On the Way':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex flex-col lg:flex-row">
      {/* Left Sidebar (Desktop) */}
      <aside className="lg:w-64 bg-[#0B2B26] text-slate-100 flex flex-col shrink-0">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
            <GTLogo className="w-9 h-8" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-base text-white truncate">GT Service</div>
            <div className="text-[11px] text-emerald-300 truncate">Admin Console</div>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar flex-1">
          <button
            type="button"
            onClick={() => setActiveSection('catalog')}
            className={`h-10 px-3.5 rounded-xl text-sm font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeSection === 'catalog'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Products</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-black/20 tabular-nums">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('categories')}
            className={`h-10 px-3.5 rounded-xl text-sm font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeSection === 'categories'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FolderTree className="w-4 h-4 shrink-0" />
              <span>Categories</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-black/20 tabular-nums">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('orders')}
            className={`h-10 px-3.5 rounded-xl text-sm font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeSection === 'orders'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4 shrink-0" />
              <span>Orders</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-black/20 tabular-nums">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('riders')}
            className={`h-10 px-3.5 rounded-xl text-sm font-medium flex items-center justify-between gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeSection === 'riders'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Bike className="w-4 h-4 shrink-0" />
              <span>Riders</span>
            </span>
            {pendingRiderCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 font-bold tabular-nums">
                {pendingRiderCount}
              </span>
            )}
          </button>
        </nav>

        <div className="hidden lg:block p-4 border-t border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs">
            {isCloudSynced ? (
              <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
                <Cloud className="w-3.5 h-3.5" />
                Live Cloud Sync On
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1.5 font-medium">
                <CloudOff className="w-3.5 h-3.5" />
                Local Preview Only
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full h-9 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb left, Actions right */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-slate-400 hidden sm:inline">GT Service</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-500 hidden sm:inline">Admin</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <h1 className="font-display font-bold text-slate-900 truncate">{sectionTitle}</h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {!isCloudSynced && (
              <button
                type="button"
                onClick={onConnectCloud}
                className="h-9 px-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Connect Google Cloud Sync</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToStorefront}
              className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront Dekhain</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="lg:hidden h-9 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Cloud Sync Banner */}
          {isCloudSynced ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-emerald-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-medium">
                <Cloud className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Live Firebase Cloud Sync active hai — yahan add hone wale har category aur product
                  sab users ko foran dikhai dain ge.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong>Demo Mode (Local Only):</strong> Doosre users ko live updates dikhane ke
                liye Google Cloud Admin se connect karain.
              </div>
              <button
                type="button"
                onClick={onConnectCloud}
                className="h-8 px-3.5 rounded-lg bg-amber-900 text-white text-xs font-semibold shrink-0 cursor-pointer"
              >
                Google Admin Connect Karain
              </button>
            </div>
          )}

          {/* 4-Column KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
                Rs {totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1 tabular-nums">
                Across {orders.length} orders
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Active Orders</span>
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {activeOrdersCount}
              </div>
              <div className="text-xs text-slate-500 mt-1">Pending &amp; in transit</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Categories</span>
                <FolderTree className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {categories.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Live storefront categories</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Products</span>
                <Users className="w-4 h-4 text-slate-700" />
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {products.length}
              </div>
              <div className="text-xs text-slate-500 mt-1 tabular-nums">
                {products.filter((p) => p.inStock).length} in stock
              </div>
            </div>
          </div>

          {/* SECTION: CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreateCategory}
                className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 self-start"
              >
                <div>
                  <h2 className="font-display font-bold text-base text-slate-900">
                    Nayi Category Add Karain
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add karne ke baad yeh category storefront par sab users ko dikhai degi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Karahi, Ice Cream, Electronics..."
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Main Group
                    </label>
                    <select
                      value={catGroup}
                      onChange={(e) =>
                        setCatGroup(e.target.value as Exclude<MainGroup, 'All'>)
                      }
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                    >
                      <option value="Food">Food</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Grocery">Grocery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Icon Style
                    </label>
                    <select
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value as CategoryIconKey)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#007A4D] hover:bg-[#00633E] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-display font-bold text-base text-slate-900">
                    All Categories ({categories.length})
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                    ).length;
                    return (
                      <div
                        key={cat.id}
                        className="px-5 py-3.5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">{cat.name}</div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            {cat.mainGroup} · {count} {count === 1 ? 'product' : 'products'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(cat.id)}
                          aria-label={`Delete category ${cat.name}`}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 inline-flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ORDERS */}
          {activeSection === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['All', 'Pending', 'Confirmed', 'On the Way', 'Delivered'] as const).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setOrderStatusFilter(status)}
                        className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          orderStatusFilter === status
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Order ID, naam, phone..."
                      className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 w-full sm:w-56"
                    />
                  </div>
                  <select
                    aria-label="Filter orders by city"
                    value={orderCityFilter}
                    onChange={(e) => setOrderCityFilter(e.target.value as 'All' | City)}
                    className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <option value="All">All Cities</option>
                    <option value="Khanewal">Khanewal</option>
                    <option value="Kabirwala">Kabirwala</option>
                    <option value="Mian Channu">Mian Channu</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-display font-bold text-slate-900">Koi order nahi mila</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Filter reset karain ya naye customer orders ka intezar karain.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items &amp; Address</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 align-top whitespace-nowrap">
                            <div className="font-mono-num font-bold text-slate-900">
                              #{order.id}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {order.createdAt}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-semibold text-slate-900">{order.customerName}</div>
                            <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                              {order.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-top max-w-xs">
                            <div className="text-xs font-medium text-slate-800">
                              {order.itemsSummary ||
                                order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {order.address} · {order.city}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-600">
                            {order.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4 align-top whitespace-nowrap text-right font-bold text-slate-900 tabular-nums">
                            Rs {order.total.toLocaleString()}
                            {order.hasCustomItems && (
                              <span className="block text-[10px] font-medium text-amber-700">
                                + custom
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-top whitespace-nowrap text-right">
                            <select
                              aria-label={`Status for order ${order.id}`}
                              value={order.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                              }
                              className={`h-8 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none ${getStatusBadgeClasses(
                                order.status
                              )}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="On the Way">On the Way</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION: RIDERS & APPLICATIONS */}
          {activeSection === 'riders' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-base text-slate-900">
                      Rider Applications
                    </h2>
                    <p className="text-xs text-slate-500">
                      Nayi requests approve ya reject karain
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {riderApplications.length} total
                  </span>
                </div>

                {riderApplications.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-500">
                    Koi rider application maujood nahi hai.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {riderApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-slate-900">
                            {app.fullName}{' '}
                            <span className="font-normal text-slate-500">
                              · {app.vehicle} · {app.city}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 tabular-nums">
                            Phone: {app.phone} · CNIC: {app.cnic}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Submitted: {app.submittedAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {app.status === 'Pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onHandleRiderApplication(app.id, 'Approved')}
                                className="h-9 px-3.5 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onHandleRiderApplication(app.id, 'Rejected')}
                                className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-lg ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200">
                  <h2 className="font-display font-bold text-base text-slate-900">
                    Active Riders ({riders.length})
                  </h2>
                  <p className="text-xs text-slate-500">Verified GT Rider fleet</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {riders.map((rider) => (
                    <div
                      key={rider.id}
                      className="px-5 py-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {rider.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {rider.vehicle} · {rider.city}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rider.rating.toFixed(1)}
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums">
                          {rider.trips} trips
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PRODUCTS / MENU & STOCK */}
          {activeSection === 'catalog' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(['All', 'Food', 'Medicine', 'Grocery'] as MainGroup[]).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setCatalogGroupFilter(grp)}
                      className={`h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        catalogGroupFilter === grp
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Item ya shop search..."
                      className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 w-full sm:w-56"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddForm((prev) => !prev)}
                    className="h-9 px-4 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {showAddForm && (
                <form
                  onSubmit={handleAddNewItem}
                  className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Naya Product Add Karain
                      </h3>
                      <p className="text-xs text-slate-500">
                        Save karne par yeh product sab users ko storefront par dikhai dega.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Special Mutton Karahi"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Price (Rs) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="e.g. 1400"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Shop / Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={newVendor}
                        onChange={(e) => setNewVendor(e.target.value)}
                        placeholder="e.g. Khanewal Karahi Point"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Main Group
                      </label>
                      <select
                        value={newGroup}
                        onChange={(e) =>
                          setNewGroup(e.target.value as Exclude<MainGroup, 'All'>)
                        }
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      >
                        <option value="Food">Food</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Grocery">Grocery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name} ({cat.mainGroup})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Badge / Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="e.g. Bestseller, Fresh, New"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="e.g. Freshly prepared with pure desi ghee..."
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://... (optional)"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="h-10 px-5 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold cursor-pointer"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Shop</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Price (Rs)</th>
                        <th className="py-3 px-4 text-right">Availability</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                          <td className="py-3 px-4 text-xs text-slate-600">{p.vendor}</td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {p.mainGroup} · {p.category}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <input
                              type="number"
                              min={1}
                              aria-label={`Price for ${p.name}`}
                              value={p.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0) onUpdateProductPrice(p.id, val);
                              }}
                              className="w-24 h-8 px-2 text-right rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold tabular-nums focus:outline-none focus:bg-white focus:border-emerald-600"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onToggleProductStock(p.id)}
                              className={`h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                p.inStock
                                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(p.id)}
                              aria-label={`Delete ${p.name}`}
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 inline-flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
