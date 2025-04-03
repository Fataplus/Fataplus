import { pb } from '@/integrations/pocketbase/client';

// Types
export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'mobile_money' | 'cash_on_delivery' | 'bank_transfer';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  mobileNumber?: string;
  provider?: string;
}

export interface OrderData {
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

// Mock payment gateway integration
const processPaymentWithGateway = async (
  amount: number,
  paymentDetails: PaymentDetails
): Promise<{ success: boolean; paymentId: string; message: string }> => {
  // This is a mock function that simulates payment processing
  // In a real application, this would integrate with a payment gateway API
  
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Simulate successful payment (in reality, this would be the response from the payment gateway)
      if (paymentDetails.method === 'credit_card') {
        // Validate credit card (very basic validation for demo purposes)
        if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCvc) {
          resolve({
            success: false,
            paymentId: '',
            message: 'Missing credit card details'
          });
          return;
        }
        
        // Simple validation (in reality, would use a proper validation library)
        if (paymentDetails.cardNumber.replace(/\\s/g, '').length !== 16) {
          resolve({
            success: false,
            paymentId: '',
            message: 'Invalid card number'
          });
          return;
        }
      } else if (paymentDetails.method === 'mobile_money') {
        // Validate mobile money details
        if (!paymentDetails.mobileNumber || !paymentDetails.provider) {
          resolve({
            success: false,
            paymentId: '',
            message: 'Missing mobile money details'
          });
          return;
        }
      }
      
      // Generate a mock payment ID
      const paymentId = 'PAY_' + Math.random().toString(36).substring(2, 15);
      
      resolve({
        success: true,
        paymentId,
        message: 'Payment processed successfully'
      });
    }, 1500); // Simulate 1.5 second processing time
  });
};

// Create an order in the database
export const createOrder = async (
  userId: string,
  orderData: OrderData,
  paymentDetails: PaymentDetails
): Promise<{ success: boolean; orderId?: string; message: string }> => {
  try {
    // Process payment first
    const paymentResult = await processPaymentWithGateway(
      orderData.totalAmount,
      paymentDetails
    );
    
    if (!paymentResult.success) {
      return {
        success: false,
        message: `Payment failed: ${paymentResult.message}`
      };
    }
    
    // Create order in database
    const order = await pb.collection('orders').create({
      user: userId,
      items: JSON.stringify(orderData.items),
      totalAmount: orderData.totalAmount,
      status: 'processing',
      paymentMethod: paymentDetails.method,
      paymentId: paymentResult.paymentId,
      shippingAddress: JSON.stringify(orderData.shippingAddress),
      notes: orderData.notes || ''
    });
    
    // Clear cart after successful order
    const cartItems = await pb.collection('cartItems').getFullList({
      filter: `user="${userId}"`
    });
    
    // Delete cart items
    for (const item of cartItems) {
      await pb.collection('cartItems').delete(item.id);
    }
    
    return {
      success: true,
      orderId: order.id,
      message: 'Order placed successfully'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create order'
    };
  }
};

// Get user orders
export const getUserOrders = async (userId: string) => {
  try {
    const orders = await pb.collection('orders').getList(1, 50, {
      filter: `user="${userId}"`,
      sort: '-created'
    });
    
    return orders.items;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  try {
    const order = await pb.collection('orders').getOne(orderId);
    return order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId: string) => {
  try {
    // Check if order can be cancelled (only pending or processing orders)
    const order = await pb.collection('orders').getOne(orderId);
    
    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }
    
    // Update order status
    const updatedOrder = await pb.collection('orders').update(orderId, {
      status: 'cancelled'
    });
    
    return updatedOrder;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};
