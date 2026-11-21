export type City = 'Khanewal' | 'Kabirwala' | 'Mian Channu';

export type MainGroup = 'All' | 'Food' | 'Medicine' | 'Grocery';

export type CategoryFilter = string;

export type CategoryIconKey =
  | 'pizza'
  | 'burger'
  | 'biryani'
  | 'shawarma'
  | 'chinese'
  | 'desserts'
  | 'medicine'
  | 'pharmacy'
  | 'grocery'
  | 'fruits'
  | 'tag';

export interface CategoryItem {
  id: string;
  name: string;
  mainGroup: Exclude<MainGroup, 'All'>;
  iconKey: CategoryIconKey;
}

export type VisualType =
  | 'image'
  | 'medicine-panadol'
  | 'medicine-brufen'
  | 'medicine-prescription'
  | 'medicine-syrup'
  | 'grocery-rice'
  | 'grocery-atta'
  | 'grocery-oil'
  | 'grocery-tea';

export interface Product {
  id: string;
  name: string;
  price: number;
  vendor: string;
  deliveryTime: string;
  category: string;
  mainGroup: Exclude<MainGroup, 'All'>;
  rating: number;
  tag?: string;
  image?: string;
  visualType: VisualType;
  description: string;
  inStock: boolean;
}

export interface HeroSlide {
  id: string;
  productId: string;
  badge: string;
  title: string;
  price: number;
  subtitle: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number | null;
  quantity: number;
  vendor: string;
  isCustom?: boolean;
  note?: string;
  image?: string;
  visualType?: VisualType;
}

export type PaymentMethod = 'Cash on Delivery' | 'JazzCash' | 'Easypaisa';

export type OrderStatus = 'Pending' | 'Confirmed' | 'On the Way' | 'Delivered';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  city: City;
  address: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  itemsSummary?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  hasCustomItems: boolean;
  status: OrderStatus;
  createdAt: string;
}

export type VehicleType = 'Bike' | 'Cycle' | 'Car / Rickshaw';

export interface Rider {
  id: string;
  name: string;
  vehicle: VehicleType;
  city: City;
  rating: number;
  trips: number;
}

export interface RiderApplication {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  vehicle: VehicleType;
  city: City;
  cnic: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface CustomerUser {
  uid?: string;
  name: string;
  phone: string;
  email?: string;
  city: City;
}
