import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { pb } from '@/integrations/pocketbase/client';
import { createOrder, PaymentDetails, ShippingAddress } from '@/services/paymentService';
import { Loader2, CreditCard, Smartphone, Truck, Building2 } from 'lucide-react';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'mobile_money' | 'cash_on_delivery' | 'bank_transfer'>('credit_card');
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    phone: ''
  });
  
  // Credit card state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  
  // Mobile money state
  const [mobileDetails, setMobileDetails] = useState({
    mobileNumber: '',
    provider: 'orange_money'
  });
  
  // Order notes
  const [notes, setNotes] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch cart items
        const result = await pb.collection('cartItems').getFullList({
          filter: `user="${user.id}"`,
          expand: 'product'
        });
        
        // Format cart items
        const items = result.map(item => ({
          id: item.id,
          product: {
            id: item.expand.product.id,
            name: item.expand.product.name,
            price: item.expand.product.price,
            imageUrl: item.expand.product.imageUrl
          },
          quantity: item.quantity
        }));
        
        setCartItems(items);
        
        // Calculate total
        const total = items.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);
        
        setTotalAmount(total);
        
        // Pre-fill shipping address if user has one
        if (user.shippingAddress) {
          try {
            const address = JSON.parse(user.shippingAddress);
            setShippingAddress(address);
          } catch (error) {
            console.error('Error parsing shipping address:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your cart items. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, [user, navigate, toast]);
  
  const handleShippingAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCardDetailsChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleMobileDetailsChange = (field: keyof typeof mobileDetails, value: string) => {
    setMobileDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validateShippingAddress = (): boolean => {
    const { fullName, street, city, region, phone } = shippingAddress;
    return Boolean(fullName && street && city && region && phone);
  };
  
  const validatePaymentDetails = (): boolean => {
    if (paymentMethod === 'credit_card') {
      const { cardNumber, cardExpiry, cardCvc } = cardDetails;
      return Boolean(cardNumber && cardExpiry && cardCvc);
    } else if (paymentMethod === 'mobile_money') {
      const { mobileNumber, provider } = mobileDetails;
      return Boolean(mobileNumber && provider);
    }
    
    return true; // No validation needed for cash on delivery or bank transfer
  };
  
  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Validate shipping address
    if (!validateShippingAddress()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required shipping address fields.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validate payment details
    if (!validatePaymentDetails()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required payment details.',
        variant: 'destructive'
      });
      return;
    }
    
    // Prepare payment details
    let paymentDetails: PaymentDetails = {
      method: paymentMethod
    };
    
    if (paymentMethod === 'credit_card') {
      paymentDetails = {
        ...paymentDetails,
        ...cardDetails
      };
    } else if (paymentMethod === 'mobile_money') {
      paymentDetails = {
        ...paymentDetails,
        ...mobileDetails
      };
    }
    
    try {
      setProcessing(true);
      
      // Create order
      const result = await createOrder(
        user.id,
        {
          items: cartItems,
          totalAmount,
          shippingAddress,
          paymentMethod,
          notes
        },
        paymentDetails
      );
      
      if (result.success) {
        // Save shipping address for future use
        try {
          await pb.collection('users').update(user.id, {
            shippingAddress: JSON.stringify(shippingAddress)
          });
        } catch (error) {
          console.error('Error saving shipping address:', error);
        }
        
        toast({
          title: 'Order Placed',
          description: 'Your order has been placed successfully!',
        });
        
        // Navigate to order confirmation page
        navigate(`/orders/${result.orderId}`);
      } else {
        toast({
          title: 'Order Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'An error occurred while placing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout title="Checkout">
        <div className="container mx-auto py-8">
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your cart...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <MainLayout title="Checkout">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Cart is Empty</CardTitle>
              <CardDescription>
                Add some products to your cart before proceeding to checkout.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Checkout">
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column - Order summary */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Enter your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleShippingAddressChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleShippingAddressChange('street', e.target.value)}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={shippingAddress.region}
                      onChange={(e) => handleShippingAddressChange('region', e.target.value)}
                      placeholder="Analamanga"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
                      placeholder="101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleShippingAddressChange('phone', e.target.value)}
                      placeholder="+261 34 12 345 67"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you want to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as any)}
                  className="mb-4"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="mobile_money" id="mobile_money" />
                    <Label htmlFor="mobile_money" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Mobile Money
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      Bank Transfer
                    </Label>
                  </div>
                </RadioGroup>
                
                {/* Payment method specific forms */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 rounded-md border p-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          value={cardDetails.cardExpiry}
                          onChange={(e) => handleCardDetailsChange('cardExpiry', e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          value={cardDetails.cardCvc}
                          onChange={(e) => handleCardDetailsChange('cardCvc', e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'mobile_money' && (
                  <div className="space-y-4 rounded-md border p-4">
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        value={mobileDetails.mobileNumber}
                        onChange={(e) => handleMobileDetailsChange('mobileNumber', e.target.value)}
                        placeholder="+261 34 12 345 67"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <RadioGroup
                        value={mobileDetails.provider}
                        onValueChange={(value) => handleMobileDetailsChange('provider', value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="orange_money" id="orange_money" />
                          <Label htmlFor="orange_money">Orange Money</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mvola" id="mvola" />
                          <Label htmlFor="mvola">MVola</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="airtel_money" id="airtel_money" />
                          <Label htmlFor="airtel_money">Airtel Money</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'bank_transfer' && (
                  <div className="rounded-md border p-4">
                    <p className="text-sm text-muted-foreground">
                      Please transfer the total amount to the following bank account:
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Bank:</span> Bank of Madagascar
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Account Name:</span> FataPlus Ltd
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Account Number:</span> 1234567890
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Reference:</span> Your email address
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Your order will be processed once we receive your payment.
                    </p>
                  </div>
                )}
                
                <div className="mt-6">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for delivery"
                    className="h-24"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Order summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <p className="text-sm">Subtotal</p>
                    <p className="text-sm font-medium">${totalAmount.toFixed(2)}</p>
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
                    <p className="text-base font-medium">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
