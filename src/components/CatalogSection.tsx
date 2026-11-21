import React from 'react';
import {
  Apple,
  CakeSlice,
  ChevronRight,
  Cross,
  Flame,
  LayoutGrid,
  Minus,
  Pill,
  Pizza,
  Plus,
  Sandwich,
  ShoppingBasket,
  Soup,
  Star,
  Tag,
  Utensils,
} from 'lucide-react';
import {
  CartItem,
  CategoryFilter,
  CategoryIconKey,
  CategoryItem,
  City,
  MainGroup,
  Product,
} from '../types';
import { ProductVisual } from './ProductVisual';

interface CatalogSectionProps {
  categories: CategoryItem[];
  products: Product[];
  selectedCity: City;
  searchQuery: string;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  activeMainGroup: MainGroup;
  onSelectMainGroup: (grp: MainGroup) => void;
  onClearFilters: () => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const ICON_MAP: Record<CategoryIconKey, React.FC<{ className?: string }>> = {
  pizza: Pizza,
  burger: Sandwich,
  biryani: Flame,
  shawarma: Utensils,
  chinese: Soup,
  desserts: CakeSlice,
  medicine: Pill,
  pharmacy: Cross,
  grocery: ShoppingBasket,
  fruits: Apple,
  tag: Tag,
};

const MAIN_GROUPS: MainGroup[] = ['All', 'Food', 'Medicine', 'Grocery'];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  categories,
  products,
  selectedCity,
  searchQuery,
  activeCategory,
  onSelectCategory,
  activeMainGroup,
  onSelectMainGroup,
  onClearFilters,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const isFiltered =
    activeCategory !== 'All' || activeMainGroup !== 'All' || searchQuery.trim().length > 0;

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ||
      item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesGroup = activeMainGroup === 'All' || item.mainGroup === activeMainGroup;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.vendor.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.mainGroup.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesGroup && matchesSearch;
  });

  const getCartQuantity = (productId: string) => {
    const found = cartItems.find((i) => i.id === productId);
    return found ? found.quantity : 0;
  };

  const renderCard = (item: Product) => {
    const qty = getCartQuantity(item.id);
    return (
      <article
        key={item.id}
        className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        {/* 4:3 Image Container */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <ProductVisual
            name={item.name}
            image={item.image}
            visualType={item.visualType}
            mainGroup={item.mainGroup}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {item.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-[11px] font-semibold shadow-xs">
              {item.tag}
            </span>
          )}
          {!item.inStock && (
            <div className="absolute inset-0 bg-slate-900/55 flex items-center justify-center">
              <span className="px-3 py-1 rounded-md bg-white text-slate-900 text-xs font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                {item.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 shrink-0 tabular-nums mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">{item.vendor}</p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {item.deliveryTime} <span aria-hidden="true">·</span> {item.category}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="font-display font-bold text-base text-slate-900 tabular-nums">
              Rs {item.price.toLocaleString()}
            </span>

            {!item.inStock ? (
              <button
                type="button"
                disabled
                className="h-9 px-3.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : qty > 0 ? (
              <div className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  aria-label={`Decrease ${item.name} quantity`}
                  className="w-8 h-8 rounded-md bg-white text-emerald-800 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs font-bold text-emerald-900 tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  aria-label={`Increase ${item.name} quantity`}
                  className="w-8 h-8 rounded-md bg-[#007A4D] text-white hover:bg-[#00633E] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="h-9 px-4 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  const popularFood = products.filter((p) => p.mainGroup === 'Food').slice(0, 4);
  const medicineItems = products.filter((p) => p.mainGroup === 'Medicine').slice(0, 4);
  const groceryItems = products.filter((p) => p.mainGroup === 'Grocery').slice(0, 4);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Categories Filter Bar */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Kya chahiye?
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Sab Dekhain</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`h-10 px-3.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid
              className={`w-3.5 h-3.5 ${
                activeCategory === 'All' ? 'text-emerald-400' : 'text-slate-500'
              }`}
            />
            <span>All</span>
          </button>

          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.iconKey] || Tag;
            const active = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.name);
                  onSelectMainGroup('All');
                }}
                className={`h-10 px-3.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Group Header + Segmented Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            Aaj kya mangwana hai?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 tabular-nums">
            {products.length} items <span aria-hidden="true">·</span> {selectedCity} ke trusted shops se
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          {MAIN_GROUPS.map((group) => {
            const active = activeMainGroup === group && activeCategory === 'All';
            return (
              <button
                key={group}
                type="button"
                onClick={() => {
                  onSelectCategory('All');
                  onSelectMainGroup(group);
                }}
                className={`h-9 px-3.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Results View OR Curated 3-Section Showcase */}
      {isFiltered ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                {activeCategory !== 'All' ? activeCategory : 'Results'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 tabular-nums">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
                {searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearFilters}
              className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <p className="font-display font-bold text-base text-slate-900">
                Koi item nahi mila
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Aap neechey &ldquo;Menu me nahi mila?&rdquo; form se koi bhi custom cheez mangwa sakte hain.
              </p>
              <button
                type="button"
                onClick={onClearFilters}
                className="mt-4 h-10 px-5 rounded-lg bg-[#007A4D] text-white text-sm font-semibold hover:bg-[#00633E] cursor-pointer"
              >
                Sab Items Dekhain
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map(renderCard)}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Popular Food */}
          <div id="food-section">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  Popular Food
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {selectedCity} ke sab se pasandeeda dishes
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectMainGroup('Food')}
                className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularFood.map(renderCard)}
            </div>
          </div>

          {/* Medicine */}
          <div id="medicine-section">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  Medicine
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Verified pharmacies se, fast delivery
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectMainGroup('Medicine')}
                className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {medicineItems.map(renderCard)}
            </div>
          </div>

          {/* Grocery */}
          <div id="grocery-section">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  Grocery
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Fresh, daily essentials ghar tak
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectMainGroup('Grocery')}
                className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {groceryItems.map(renderCard)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
