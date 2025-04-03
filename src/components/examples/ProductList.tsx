import { useState, useEffect } from 'react';
import { getProducts } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

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

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Products</h2>
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No products found</div>
      ) : (
        products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="bg-muted rounded-md h-20 w-20 flex-shrink-0 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
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
                    <span>{product.location}</span>
                  </div>
                  <Button size="sm" className="w-full">Add to Cart</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProductList;
