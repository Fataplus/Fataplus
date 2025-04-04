// PocketBase collection types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  location?: string;
  userType: 'farmer' | 'seller' | 'learner' | 'admin';
  plan: 'free' | 'premium';
  created: string;
  updated: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  seller: string; // Reference to users collection
  sellerName: string;
  location: string;
  imageUrl?: string;
  category: string;
  created: string;
  updated: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  imageUrl?: string;
  category: string;
  created: string;
  updated: string;
}

export interface UserCourse {
  id: string;
  user: string; // Reference to users collection
  course: string; // Reference to courses collection
  completedLessons: number;
  created: string;
  updated: string;
  expand?: {
    course?: Course;
  };
}

export interface Post {
  id: string;
  author: string; // Reference to users collection
  content: string;
  imageUrl?: string;
  postType: 'general' | 'question' | 'marketplace';
  created: string;
  updated: string;
  expand?: {
    author?: User;
  };
}

export interface Comment {
  id: string;
  post: string; // Reference to posts collection
  author: string; // Reference to users collection
  content: string;
  created: string;
  updated: string;
  expand?: {
    author?: User;
  };
}

export interface Like {
  id: string;
  post: string; // Reference to posts collection
  user: string; // Reference to users collection
  created: string;
}

export interface CartItem {
  id: string;
  user: string; // Reference to users collection
  product: string; // Reference to products collection
  quantity: number;
  created: string;
  updated: string;
  expand?: {
    product?: Product;
  };
}

export interface Order {
  id: string;
  user: string; // Reference to users collection
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created: string;
  updated: string;
}
