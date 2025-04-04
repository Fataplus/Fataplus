'use server';

import PocketBase from 'pocketbase';
import { revalidatePath } from 'next/cache';
import { getAuthUser } from './auth';

// Initialize PocketBase on the server
const initPocketBase = () => {
  const pocketbaseUrl = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
  return new PocketBase(pocketbaseUrl);
};

export async function getProducts(category?: string) {
  try {
    const pb = initPocketBase();
    let filter = '';
    
    if (category && category !== 'all') {
      filter = `category = "${category}"`;
    }
    
    const records = await pb.collection('products').getList(1, 50, {
      filter,
      sort: '-created',
    });
    
    return {
      items: records.items,
      totalItems: records.totalItems,
      totalPages: records.totalPages,
    };
  } catch (error: any) {
    console.error('Error getting products:', error);
    throw new Error(error.message || 'Failed to get products');
  }
}

export async function getProduct(id: string) {
  try {
    const pb = initPocketBase();
    const record = await pb.collection('products').getOne(id);
    return record;
  } catch (error: any) {
    console.error('Error getting product:', error);
    throw new Error(error.message || 'Failed to get product');
  }
}

export async function createProduct(formData: FormData) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a product');
    }
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('imageUrl') as File;
    
    if (!name || !price || !category || !location) {
      throw new Error('Name, price, category, and location are required');
    }
    
    const pb = initPocketBase();
    
    // Create form data for file upload
    const pbFormData = new FormData();
    pbFormData.append('name', name);
    pbFormData.append('price', price.toString());
    pbFormData.append('description', description);
    pbFormData.append('category', category);
    pbFormData.append('location', location);
    pbFormData.append('seller', user.id);
    pbFormData.append('sellerName', user.name);
    
    if (imageFile && imageFile.size > 0) {
      pbFormData.append('imageUrl', imageFile);
    }
    
    const record = await pb.collection('products').create(pbFormData);
    
    revalidatePath('/shop');
    return record;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      throw new Error('You must be logged in to update a product');
    }
    
    const pb = initPocketBase();
    
    // Check if user is the seller
    const product = await pb.collection('products').getOne(id);
    
    if (product.seller !== user.id && user.userType !== 'admin') {
      throw new Error('You do not have permission to update this product');
    }
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('imageUrl') as File;
    
    if (!name || !price || !category || !location) {
      throw new Error('Name, price, category, and location are required');
    }
    
    // Create form data for file upload
    const pbFormData = new FormData();
    pbFormData.append('name', name);
    pbFormData.append('price', price.toString());
    pbFormData.append('description', description);
    pbFormData.append('category', category);
    pbFormData.append('location', location);
    
    if (imageFile && imageFile.size > 0) {
      pbFormData.append('imageUrl', imageFile);
    }
    
    const record = await pb.collection('products').update(id, pbFormData);
    
    revalidatePath('/shop');
    revalidatePath(`/shop/${id}`);
    return record;
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.message || 'Failed to update product');
  }
}

export async function deleteProduct(id: string) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      throw new Error('You must be logged in to delete a product');
    }
    
    const pb = initPocketBase();
    
    // Check if user is the seller
    const product = await pb.collection('products').getOne(id);
    
    if (product.seller !== user.id && user.userType !== 'admin') {
      throw new Error('You do not have permission to delete this product');
    }
    
    await pb.collection('products').delete(id);
    
    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }
}
