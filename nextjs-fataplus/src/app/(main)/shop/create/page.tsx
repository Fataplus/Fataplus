import { Metadata } from 'next';
import Link from 'next/link';
import { createProduct } from '@/actions/products';
import MainLayout from '@/components/layout/MainLayout';
import ProductForm from '@/components/shop/ProductForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Product | FataPlus Shop',
  description: 'Create a new product listing on FataPlus',
};

export default function CreateProductPage() {
  return (
    <MainLayout title="Create Product">
      <div className="container py-6">
        <div className="mb-6">
          <Link href="/shop" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
        
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Create New Product</h1>
          <ProductForm action={createProduct} />
        </div>
      </div>
    </MainLayout>
  );
}
