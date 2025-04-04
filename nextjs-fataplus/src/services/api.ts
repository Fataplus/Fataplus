import { getPocketBase } from '@/integrations/pocketbase/client';
import type {
  User,
  Product,
  Course,
  UserCourse,
  Post,
  Comment,
  Like,
  CartItem,
  Order
} from '@/integrations/pocketbase/types';

// User API
export const getUserProfile = async (userId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('users').getOne(userId);
    return record as unknown as User;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('users').update(userId, updates);
    return record as unknown as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Products API
export const getProducts = async (category?: string) => {
  try {
    const pb = getPocketBase();
    let filter = '';
    if (category) {
      filter = `category = "${category}"`;
    }

    const records = await pb.collection('products').getList(1, 50, {
      filter,
      sort: '-created',
    });

    return records.items as unknown as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProduct = async (productId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('products').getOne(productId);
    return record as unknown as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created' | 'updated'>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('products').create(productData);
    return record as unknown as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('products').update(productId, updates);
    return record as unknown as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const pb = getPocketBase();
    await pb.collection('products').delete(productId);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Courses API
export const getCourses = async (category?: string) => {
  try {
    const pb = getPocketBase();
    let filter = '';
    if (category) {
      filter = `category = "${category}"`;
    }

    const records = await pb.collection('courses').getList(1, 50, {
      filter,
      sort: '-created',
    });

    return records.items as unknown as Course[];
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getCourse = async (courseId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('courses').getOne(courseId);
    return record as unknown as Course;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const getUserCourses = async (userId: string) => {
  try {
    const pb = getPocketBase();
    const records = await pb.collection('userCourses').getList(1, 50, {
      filter: `user = "${userId}"`,
      expand: 'course',
    });

    return records.items as unknown as UserCourse[];
  } catch (error) {
    console.error('Error getting user courses:', error);
    throw error;
  }
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('userCourses').create({
      user: userId,
      course: courseId,
      completedLessons: 0,
    });

    return record as unknown as UserCourse;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const updateCourseProgress = async (userCourseId: string, completedLessons: number) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('userCourses').update(userCourseId, {
      completedLessons,
    });

    return record as unknown as UserCourse;
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

// Community API
export const getPosts = async (postType?: string) => {
  try {
    const pb = getPocketBase();
    let filter = '';
    if (postType) {
      filter = `postType = "${postType}"`;
    }

    const records = await pb.collection('posts').getList(1, 20, {
      filter,
      sort: '-created',
      expand: 'author',
    });

    return records.items as unknown as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPost = async (postId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('posts').getOne(postId, {
      expand: 'author',
    });

    return record as unknown as Post;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const createPost = async (postData: Omit<Post, 'id' | 'created' | 'updated' | 'expand'>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('posts').create(postData);
    return record as unknown as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const pb = getPocketBase();
    const records = await pb.collection('comments').getList(1, 100, {
      filter: `post = "${postId}"`,
      sort: 'created',
      expand: 'author',
    });

    return records.items as unknown as Comment[];
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const createComment = async (commentData: Omit<Comment, 'id' | 'created' | 'updated' | 'expand'>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('comments').create(commentData);
    return record as unknown as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const pb = getPocketBase();
    // Check if already liked
    const existingLikes = await pb.collection('likes').getList(1, 1, {
      filter: `post = "${postId}" && user = "${userId}"`,
    });

    if (existingLikes.items.length > 0) {
      return existingLikes.items[0] as unknown as Like;
    }

    // Create new like
    const record = await pb.collection('likes').create({
      post: postId,
      user: userId,
    });

    return record as unknown as Like;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  try {
    const pb = getPocketBase();
    // Find the like record
    const existingLikes = await pb.collection('likes').getList(1, 1, {
      filter: `post = "${postId}" && user = "${userId}"`,
    });

    if (existingLikes.items.length > 0) {
      const likeId = existingLikes.items[0].id;
      await pb.collection('likes').delete(likeId);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

// Cart API
export const getCartItems = async (userId: string) => {
  try {
    const pb = getPocketBase();
    const records = await pb.collection('cartItems').getList(1, 100, {
      filter: `user = "${userId}"`,
      expand: 'product',
    });

    return records.items as unknown as CartItem[];
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
  try {
    const pb = getPocketBase();
    // Check if already in cart
    const existingItems = await pb.collection('cartItems').getList(1, 1, {
      filter: `user = "${userId}" && product = "${productId}"`,
    });

    if (existingItems.items.length > 0) {
      // Update quantity
      const existingItem = existingItems.items[0];
      const newQuantity = (existingItem.quantity || 0) + quantity;
      
      const record = await pb.collection('cartItems').update(existingItem.id, {
        quantity: newQuantity,
      });

      return record as unknown as CartItem;
    }

    // Create new cart item
    const record = await pb.collection('cartItems').create({
      user: userId,
      product: productId,
      quantity,
    });

    return record as unknown as CartItem;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('cartItems').update(cartItemId, {
      quantity,
    });

    return record as unknown as CartItem;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: string) => {
  try {
    const pb = getPocketBase();
    await pb.collection('cartItems').delete(cartItemId);
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Orders API
export const getOrders = async (userId: string) => {
  try {
    const pb = getPocketBase();
    const records = await pb.collection('orders').getList(1, 50, {
      filter: `user = "${userId}"`,
      sort: '-created',
    });

    return records.items as unknown as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('orders').getOne(orderId);
    return record as unknown as Order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'created' | 'updated'>) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('orders').create(orderData);
    return record as unknown as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const pb = getPocketBase();
    const record = await pb.collection('orders').update(orderId, {
      status,
    });

    return record as unknown as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
