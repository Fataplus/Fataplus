import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/services/paymentService';
import { Loader2, Clock, RefreshCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(user.id);
        
        // Parse JSON fields
        const parsedOrders = userOrders.map((order: any) => ({
          ...order,
          items: JSON.parse(order.items),
          shippingAddress: JSON.parse(order.shippingAddress)
        }));
        
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your orders. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate, toast]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <RefreshCcw className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'refunded':
        return <RefreshCcw className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'mobile_money':
        return 'Mobile Money';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };
  
  const getFilteredOrders = (status: string | null) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };
  
  if (loading) {
    return (
      <MainLayout title="My Orders">
        <div className="container mx-auto py-8">
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your orders...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (orders.length === 0) {
    return (
      <MainLayout title="My Orders">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Orders Found</CardTitle>
              <CardDescription>
                You haven't placed any orders yet.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="My Orders">
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <OrdersList orders={getFilteredOrders(null)} />
          </TabsContent>
          
          <TabsContent value="pending">
            <OrdersList orders={getFilteredOrders('pending')} />
          </TabsContent>
          
          <TabsContent value="processing">
            <OrdersList orders={getFilteredOrders('processing')} />
          </TabsContent>
          
          <TabsContent value="completed">
            <OrdersList orders={getFilteredOrders('completed')} />
          </TabsContent>
          
          <TabsContent value="cancelled">
            <OrdersList orders={getFilteredOrders('cancelled')} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
  
  function OrdersList({ orders }: { orders: any[] }) {
    if (orders.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No orders found in this category.</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-2">
              <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.created)}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{getStatusBadge(order.status)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="mb-2 font-medium">Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h3 className="mb-1 font-medium">Shipping Address</h3>
                    <p className="text-sm">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.region}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">Payment</h3>
                    <p className="text-sm">{formatPaymentMethod(order.paymentMethod)}</p>
                    <p className="text-sm font-medium">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};

export default OrdersPage;
