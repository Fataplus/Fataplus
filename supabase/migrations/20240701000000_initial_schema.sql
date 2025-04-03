-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  location TEXT,
  user_type TEXT NOT NULL DEFAULT 'farmer', -- farmer, seller, learner, admin
  avatar_url TEXT,
  plan TEXT DEFAULT 'free', -- free, premium
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- stored in cents/smallest currency unit
  description TEXT,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lessons INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses table for tracking progress
CREATE TABLE IF NOT EXISTS public.user_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT DEFAULT 'general', -- general, question, marketplace
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create cart table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read all users
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Products can be created by authenticated users
CREATE POLICY "Products can be created by authenticated users" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Products can be updated by the seller
CREATE POLICY "Products can be updated by the seller" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id);

-- Products can be deleted by the seller
CREATE POLICY "Products can be deleted by the seller" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- Courses are viewable by everyone
CREATE POLICY "Courses are viewable by everyone" ON public.courses
  FOR SELECT USING (true);

-- User course progress is viewable by the user
CREATE POLICY "User course progress is viewable by the user" ON public.user_courses
  FOR SELECT USING (auth.uid() = user_id);

-- User course progress can be updated by the user
CREATE POLICY "User course progress can be updated by the user" ON public.user_courses
  FOR UPDATE USING (auth.uid() = user_id);

-- Posts are viewable by everyone
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

-- Posts can be created by authenticated users
CREATE POLICY "Posts can be created by authenticated users" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Posts can be updated by the author
CREATE POLICY "Posts can be updated by the author" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Posts can be deleted by the author
CREATE POLICY "Posts can be deleted by the author" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments are viewable by everyone
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

-- Comments can be created by authenticated users
CREATE POLICY "Comments can be created by authenticated users" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Comments can be updated by the author
CREATE POLICY "Comments can be updated by the author" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Comments can be deleted by the author
CREATE POLICY "Comments can be deleted by the author" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- Likes are viewable by everyone
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

-- Likes can be created by authenticated users
CREATE POLICY "Likes can be created by authenticated users" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Likes can be deleted by the user
CREATE POLICY "Likes can be deleted by the user" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Cart items are viewable by the user
CREATE POLICY "Cart items are viewable by the user" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Cart items can be created by the user
CREATE POLICY "Cart items can be created by the user" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cart items can be updated by the user
CREATE POLICY "Cart items can be updated by the user" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Cart items can be deleted by the user
CREATE POLICY "Cart items can be deleted by the user" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);
