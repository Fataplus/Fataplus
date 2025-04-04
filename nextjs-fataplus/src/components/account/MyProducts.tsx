'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash, ShoppingBag } from 'lucide-react';
import { getPocketBase } from '@/integrations/pocketbase/client';
import DeleteProductButton from '@/components/shop/DeleteProductButton';

interface MyProductsProps {
  userId: string;
}

export default function MyProducts({ userId }: MyProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const pb = getPocketBase();
        const records = await pb.collection('products').getList(1, 50, {
          filter: `seller = "${userId}"`,
          sort: '-created',
        });
        setProducts(records.items);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No products yet</h3>
        <p className="mb-4 text-muted-foreground">
          Start selling by creating your first product listing.
        </p>
        <Link href="/shop/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Your Products ({products.length})</h3>
        <Link href="/shop/create">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <h4 className="font-medium">{product.name}</h4>
                <span className="font-bold">{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between">
                <Link href={`/shop/${product.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  <Link href={`/shop/edit/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
