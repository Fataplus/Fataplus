'use server';

import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import { redirect } from 'next/navigation';

// Initialize PocketBase on the server
const initPocketBase = () => {
  const pocketbaseUrl = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
  return new PocketBase(pocketbaseUrl);
};

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectUrl = formData.get('redirectUrl') as string || '/';
  
  if (!email || !password) {
    return {
      error: 'Email and password are required'
    };
  }
  
  try {
    const pb = initPocketBase();
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    // Set auth cookie
    const cookieStore = cookies();
    cookieStore.set('pb_auth', JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.model
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    redirect(redirectUrl);
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      error: error.message || 'Failed to login'
    };
  }
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;
  const name = formData.get('name') as string;
  const userType = formData.get('userType') as string || 'farmer';
  const redirectUrl = formData.get('redirectUrl') as string || '/';
  
  if (!email || !password || !passwordConfirm || !name) {
    return {
      error: 'All fields are required'
    };
  }
  
  if (password !== passwordConfirm) {
    return {
      error: 'Passwords do not match'
    };
  }
  
  try {
    const pb = initPocketBase();
    
    // Create user
    const userData = {
      email,
      password,
      passwordConfirm,
      name,
      userType,
      plan: 'free'
    };
    
    const user = await pb.collection('users').create(userData);
    
    // Auto login after registration
    await pb.collection('users').authWithPassword(email, password);
    
    // Set auth cookie
    const cookieStore = cookies();
    cookieStore.set('pb_auth', JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.model
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    redirect(redirectUrl);
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      error: error.message || 'Failed to register'
    };
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('pb_auth');
  
  redirect('/');
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('pb_auth');
  
  if (!authCookie) {
    return null;
  }
  
  try {
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.token) {
      return null;
    }
    
    // Validate token
    const pb = initPocketBase();
    pb.authStore.save(authData.token, authData.model);
    
    if (!pb.authStore.isValid) {
      // Clear invalid auth cookie
      cookieStore.delete('pb_auth');
      return null;
    }
    
    return pb.authStore.model;
  } catch (e) {
    // Clear invalid auth cookie
    cookieStore.delete('pb_auth');
    return null;
  }
}
