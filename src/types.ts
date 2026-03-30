export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  origin: string;
  taste: string;
  brewingGuide: string;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shippingAddress: any;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  tags: string[];
  image: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
