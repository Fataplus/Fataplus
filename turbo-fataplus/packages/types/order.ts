export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  country?: string;
  phone: string;
}
