// src/admin/types/index.ts

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AdminBook {
  id: string;
  title: string;
  author_id: string | null;
  category_id: string | null;
  price: number;
  original_price: number | null;
  price_range: string | null;
  format: string;
  image_url: string;
  rating: number;
  stock_status: number;
  publisher: string | null;
  publication_date: string | null;
  language: string;
  description: string | null;
  is_bestseller: number;
  is_featured: number;
  is_onsale: number;
  is_mostviewed: number;
  is_deal_of_week: number;
  is_new_release: number;
  new_release_tab: string | null;
  is_biography_book: number;
  author_name?: string;
  category_name?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  icon_class: string | null;
  image_url: string | null;
  slug: string;
  books_count?: number;
}

export interface AdminAuthor {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  books_count?: number;
}

export interface AdminOrderItem {
  id: number;
  order_id: string;
  book_id: string | null;
  book_title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface AdminOrder {
  id: string;
  user_id: number | null;
  first_name: string;
  last_name: string;
  company_name: string | null;
  country: string;
  street_address: string;
  apartment: string | null;
  city: string;
  county: string | null;
  postcode: string;
  phone: string;
  email: string;
  order_notes: string | null;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
  transaction_id: string | null;
  coupon_code: string | null;
  discount_amount: number;
  subtotal: number;
  grand_total: number;
  status: 'On hold' | 'Completed' | 'Processing' | 'Cancelled';
  created_at: string;
  items?: AdminOrderItem[];
}

export interface AdminContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  text: string;
  created_at: string;
}

export interface AdminSubscriber {
  id: number;
  email: string;
  created_at: string;
}

export interface AdminDashboardKPIs {
  totalSales: number;
  totalOrders: number;
  totalBooks: number;
  totalCustomers: number;
  totalSubscribers: number;
  lowStockCount: number;
}

export interface AdminDashboardData {
  kpis: AdminDashboardKPIs;
  salesChart: Array<{ date: string; sales: number }>;
  recentOrders: Array<{
    id: string;
    first_name: string;
    last_name: string;
    grand_total: number;
    status: string;
    created_at: string;
  }>;
  lowStockBooks: Array<{
    id: string;
    title: string;
    price: number;
    image_url: string;
  }>;
  popularCategories: Array<{
    name: string;
    sales_count: number;
  }>;
}

export interface AdminBanner {
  id: number;
  title_prefix: string | null;
  title_highlighted: string | null;
  title_suffix: string | null;
  subtitle: string | null;
  image_url: string;
  action_url: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AdminWishlistItem {
  id: number;
  user_id: number;
  book_id: string;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  book_title: string | null;
  book_price: number | null;
  book_image_url: string | null;
}

export interface AdminTransaction {
  id: number;
  order_id: string;
  transaction_ref: string;
  payment_gateway: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway_response: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  order_total: number | null;
}
