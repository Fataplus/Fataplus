import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, updateProduct } from '@/actions/products';
import MainLayout from '@/components/layout/MainLayout';
import ProductForm from '@/components/shop/ProductForm';
import { ArrowLeft } from 'lucide-react';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);
    
    return {
      title: `Edit ${product.name} | FataPlus Shop`,
      description: `Edit ${product.name} on FataPlus`,
    };
  } catch (error) {
    return {
      title: 'Edit Product | FataPlus Shop',
      description: 'Edit product on FataPlus',
    };
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product;
  
  try {
    product = await getProduct(params.id);
  } catch (error) {
    notFound();
  }
  
  const updateProductWithId = async (formData: FormData) => {
    'use server';
    return updateProduct(params.id, formData);
  };
  
  return (
    <MainLayout title="Edit Product">
      <div className="container py-6">
        <div className="mb-6">
          <Link href={`/shop/${params.id}`} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </div>
        
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
          <ProductForm action={updateProductWithId} initialData={product} />
        </div>
      </div>
    </MainLayout>
  );
}
