
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart, MapPin, Plus, Filter, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getProducts, addToCart } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        toast({
          title: 'Error',
          description: 'Failed to fetch products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingToCart(productId);
      await addToCart(user.id, productId);
      toast({
        title: 'Added to Cart',
        description: 'Item has been added to your cart.',
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <MainLayout>
      <div className="fataplus-container py-6">
        <h1 className="text-2xl font-bold mb-4">Shop</h1>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter row */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
            <Filter className="h-3 w-3" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">Seeds</Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">Equipment</Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">Supplies</Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">All Categories</Button>
        </div>

        {/* Product tabs */}
        <Tabs defaultValue="products" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading products: {error.message}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-4">
                {filteredProducts.map(product => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="bg-muted rounded-md h-20 w-20 flex-shrink-0 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium line-clamp-1">{product.name}</h3>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">{product.category}</span>
                          </div>
                          <p className="text-lg font-semibold text-primary">Ar {formatPrice(product.price)}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{product.seller_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {product.location}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            variant="outline"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={addingToCart === product.id}
                          >
                            {addingToCart === product.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">No products found</p>
                  <p className="text-sm text-muted-foreground">Try a different search term</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sellers">
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Seller directory</p>
                <p className="text-sm text-muted-foreground mb-4">Find local sellers in your area</p>
                <Button variant="outline">View All Sellers</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Marketplace Map</p>
                <p className="text-sm text-muted-foreground mb-4">Find sellers and products near you</p>
                <Button variant="outline">Open Map</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cart summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Your Cart</p>
                  {user ? (
                    <p className="text-xs text-muted-foreground">View your cart items</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Login to view your cart</p>
                  )}
                </div>
              </div>
              <Button size="sm" disabled={!user}>View</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
