import { pb, getCurrentUser } from '@/integrations/pocketbase/client';
import type {
  User,
  Product,
  Course,
  UserCourse,
  Post,
  Comment,
  Like,
  CartItem
} from '@/integrations/pocketbase/types';

// User API
export const getUserProfile = async (userId: string) => {
  try {
    const record = await pb.collection('users').getOne(userId);
    return record as unknown as User;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
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

export const getProductById = async (productId: string) => {
  try {
    const record = await pb.collection('products').getOne(productId);
    return record as unknown as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created' | 'updated'>) => {
  try {
    const record = await pb.collection('products').create(product);
    return record as unknown as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Courses API
export const getCourses = async (category?: string) => {
  try {
    let filter = '';
    if (category) {
      filter = `category = "${category}"`;
    }

    const records = await pb.collection('courses').getList(1, 50, {
      filter,
      sort: 'title',
    });

    return records.items as unknown as Course[];
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const record = await pb.collection('courses').getOne(courseId);
    return record as unknown as Course;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const getUserCourseProgress = async (userId: string, courseId?: string) => {
  try {
    let filter = `user = "${userId}"`;
    if (courseId) {
      filter += ` && course = "${courseId}"`;
    }

    const records = await pb.collection('userCourses').getList(1, 50, {
      filter,
      expand: 'course',
    });

    return records.items as unknown as UserCourse[];
  } catch (error) {
    console.error('Error getting user course progress:', error);
    throw error;
  }
};

export const updateCourseProgress = async (userId: string, courseId: string, completedLessons: number) => {
  try {
    // Check if record exists
    let filter = `user = "${userId}" && course = "${courseId}"`;
    const existingRecords = await pb.collection('userCourses').getList(1, 1, { filter });

    if (existingRecords.items.length > 0) {
      // Update existing record
      const record = await pb.collection('userCourses').update(existingRecords.items[0].id, {
        completedLessons,
      });
      return record as unknown as UserCourse;
    } else {
      // Create new record
      const record = await pb.collection('userCourses').create({
        user: userId,
        course: courseId,
        completedLessons,
      });
      return record as unknown as UserCourse;
    }
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

// Posts API
export const getPosts = async (postType?: string) => {
  try {
    let filter = '';
    if (postType) {
      filter = `postType = "${postType}"`;
    }

    const records = await pb.collection('posts').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'author',
    });

    // Get likes and comments count for each post
    const postsWithCounts = await Promise.all(records.items.map(async (post) => {
      const likesCount = await pb.collection('likes').getList(1, 1, {
        filter: `post = "${post.id}"`,
        countOnly: true,
      });

      const commentsCount = await pb.collection('comments').getList(1, 1, {
        filter: `post = "${post.id}"`,
        countOnly: true,
      });

      return {
        ...post,
        likesCount: likesCount.totalItems,
        commentsCount: commentsCount.totalItems,
      };
    }));

    return postsWithCounts as unknown as (Post & { likesCount: number, commentsCount: number })[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  try {
    const record = await pb.collection('posts').getOne(postId, {
      expand: 'author',
    });

    // Get comments for the post
    const comments = await pb.collection('comments').getList(1, 50, {
      filter: `post = "${postId}"`,
      sort: 'created',
      expand: 'author',
    });

    // Get likes count
    const likesCount = await pb.collection('likes').getList(1, 1, {
      filter: `post = "${postId}"`,
      countOnly: true,
    });

    return {
      ...record,
      comments: comments.items,
      likesCount: likesCount.totalItems,
    } as unknown as (Post & { comments: Comment[], likesCount: number });
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const createPost = async (post: Omit<Post, 'id' | 'created' | 'updated'>) => {
  try {
    const record = await pb.collection('posts').create(post);
    return record as unknown as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    // Check if already liked
    const existingLikes = await pb.collection('likes').getList(1, 1, {
      filter: `post = "${postId}" && user = "${userId}"`,
    });

    if (existingLikes.items.length === 0) {
      // Create new like
      const record = await pb.collection('likes').create({
        post: postId,
        user: userId,
      });
      return record as unknown as Like;
    }

    return existingLikes.items[0] as unknown as Like;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  try {
    // Find the like record
    const existingLikes = await pb.collection('likes').getList(1, 1, {
      filter: `post = "${postId}" && user = "${userId}"`,
    });

    if (existingLikes.items.length > 0) {
      // Delete the like
      await pb.collection('likes').delete(existingLikes.items[0].id);
    }

    return true;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const createComment = async (comment: Omit<Comment, 'id' | 'created' | 'updated'>) => {
  try {
    const record = await pb.collection('comments').create(comment);
    return record as unknown as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Cart API
export const getCartItems = async (userId: string) => {
  try {
    const records = await pb.collection('cartItems').getList(1, 50, {
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
    // Check if item already in cart
    const existingItems = await pb.collection('cartItems').getList(1, 1, {
      filter: `user = "${userId}" && product = "${productId}"`,
    });

    if (existingItems.items.length > 0) {
      // Update quantity
      const currentQuantity = existingItems.items[0].quantity || 0;
      const record = await pb.collection('cartItems').update(existingItems.items[0].id, {
        quantity: currentQuantity + quantity,
      });
      return record as unknown as CartItem;
    } else {
      // Create new cart item
      const record = await pb.collection('cartItems').create({
        user: userId,
        product: productId,
        quantity,
      });
      return record as unknown as CartItem;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  try {
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
    await pb.collection('cartItems').delete(cartItemId);
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Authentication helpers
export const getCurrentAuthUser = async () => {
  return getCurrentUser();
};

export const signIn = async (email: string, password: string) => {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    // Create the user
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name: userData.name,
      location: userData.location,
      userType: userData.userType || 'farmer',
      plan: 'free',
    });

    // Authenticate the user
    const authData = await pb.collection('users').authWithPassword(email, password);

    return {
      user: record,
      authData,
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async () => {
  pb.authStore.clear();
  return true;
};
