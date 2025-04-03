import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderDetails, cancelOrder } from '@/services/paymentService';
import { Loader2, CheckCircle, AlertCircle, Clock, XCircle, RefreshCcw, Truck } from 'lucide-react';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !user) {
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        const orderData = await getOrderDetails(orderId);
        
        // Check if order belongs to current user
        if (orderData.user !== user.id && user.userType !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to view this order.',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }
        
        // Parse JSON fields
        orderData.items = JSON.parse(orderData.items);
        orderData.shippingAddress = JSON.parse(orderData.shippingAddress);
        
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details. Please try again.',
          variant: 'destructive'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, user, navigate, toast]);
  
  const handleCancelOrder = async () => {
    if (!order || !orderId) return;
    
    try {
      setCancelling(true);
      await cancelOrder(orderId);
      
      // Update local order state
      setOrder({
        ...order,
        status: 'cancelled'
      });
      
      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully.',
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel order.',
        variant: 'destructive'
      });
    } finally {
      setCancelling(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'processing':
        return <RefreshCcw className="h-6 w-6 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'refunded':
        return <RefreshCcw className="h-6 w-6 text-purple-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  if (loading) {
    return (
      <MainLayout title="Order Confirmation">
        <div className="container mx-auto py-8">
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading order details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!order) {
    return (
      <MainLayout title="Order Not Found">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
              <CardDescription>
                The order you are looking for does not exist or you do not have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/')}>Return to Home</Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Order Confirmation">
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <div className="flex items-center">
            {getStatusIcon(order.status)}
            <span className="ml-2">{getStatusBadge(order.status)}</span>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column - Order details */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Placed on {formatDate(order.created)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        )}
                        <div className="ml-4">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <p className="text-sm">Subtotal</p>
                    <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Shipping</p>
                    <p className="text-sm font-medium">$0.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Tax</p>
                    <p className="text-sm font-medium">$0.00</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Total</p>
                    <p className="text-base font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.region}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Method:</span>{' '}
                      {formatPaymentMethod(order.paymentMethod)}
                    </p>
                    {order.paymentId && (
                      <p>
                        <span className="font-medium">Payment ID:</span> {order.paymentId}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Status:</span> Paid
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right column - Order summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Order #{order.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-primary" />
                      <span className="ml-2 font-medium">Delivery Status</span>
                    </div>
                    <p className="mt-2 text-sm">
                      {order.status === 'completed' ? (
                        'Your order has been delivered.'
                      ) : order.status === 'processing' ? (
                        'Your order is being processed and will be shipped soon.'
                      ) : order.status === 'pending' ? (
                        'Your order is pending confirmation.'
                      ) : order.status === 'cancelled' ? (
                        'This order has been cancelled.'
                      ) : (
                        'Status unknown.'
                      )}
                    </p>
                  </div>
                  
                  {order.notes && (
                    <div>
                      <h3 className="mb-1 font-medium">Order Notes</h3>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
                
                {(order.status === 'pending' || order.status === 'processing') && (
                  <Button
                    onClick={handleCancelOrder}
                    variant="destructive"
                    className="w-full"
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Order'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmationPage;
