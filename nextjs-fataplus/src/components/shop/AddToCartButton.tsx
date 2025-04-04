'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getPocketBase } from '@/integrations/pocketbase/client';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
}

export default function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirectUrl=/shop/${productId}`);
      return;
    }

    setIsLoading(true);

    try {
      const pb = getPocketBase();
      
      // Check if already in cart
      const existingItems = await pb.collection('cartItems').getList(1, 1, {
        filter: `user = "${user.id}" && product = "${productId}"`,
      });

      if (existingItems.items.length > 0) {
        // Update quantity
        const existingItem = existingItems.items[0];
        const newQuantity = (existingItem.quantity || 0) + quantity;
        
        await pb.collection('cartItems').update(existingItem.id, {
          quantity: newQuantity,
        });
      } else {
        // Create new cart item
        await pb.collection('cartItems').create({
          user: user.id,
          product: productId,
          quantity,
        });
      }

      setIsAdded(true);
      toast.success('Added to cart');
      
      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
      
      // Refresh the page to update cart count
      router.refresh();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
