import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/actions/products';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, ShoppingCart, MapPin, User, Calendar, Edit, Trash } from 'lucide-react';
import AddToCartButton from '@/components/shop/AddToCartButton';
import DeleteProductButton from '@/components/shop/DeleteProductButton';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);
    
    return {
      title: `${product.name} | FataPlus Shop`,
      description: product.description || `Buy ${product.name} on FataPlus`,
    };
  } catch (error) {
    return {
      title: 'Product | FataPlus Shop',
      description: 'View product details on FataPlus',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  
  try {
    product = await getProduct(params.id);
  } catch (error) {
    notFound();
  }
  
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-6">
          <Link href="/shop" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </div>
            
            <div className="mt-4 flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{product.location}</span>
              <span className="mx-2">•</span>
              <User className="mr-1 h-4 w-4" />
              <span>{product.sellerName}</span>
              <span className="mx-2">•</span>
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formatDate(product.created)}</span>
            </div>
            
            <Separator className="my-6" />
            
            {product.description && (
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}
            
            <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <AddToCartButton productId={product.id} />
              
              <Button variant="outline">
                Contact Seller
              </Button>
            </div>
            
            {/* Admin/Seller Actions */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Product Actions</h3>
                    <div className="flex space-x-2">
                      <Link href={`/shop/edit/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* This would be populated with actual related products */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <div className="h-full w-full bg-gray-200" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Related Product {i}</h3>
                  <p className="text-sm text-muted-foreground">Sample description</p>
                  <div className="mt-2 font-bold">15,000 Ar</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
