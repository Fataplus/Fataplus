import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

// Define protected routes
const adminRoutes = ['/admin'];
const superuserRoutes = ['/superuser'];
const authRoutes = ['/account', '/shop/create', '/shop/edit'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isSuperuserRoute = superuserRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Skip middleware for non-protected routes
  if (!isAdminRoute && !isSuperuserRoute && !isAuthRoute) {
    return NextResponse.next();
  }
  
  // Skip middleware for login routes
  if (pathname === '/admin/login' || pathname === '/superuser/login') {
    return NextResponse.next();
  }
  
  // Get auth cookie
  const authCookie = request.cookies.get('pb_auth');
  
  if (!authCookie) {
    // Redirect to login page
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else if (isSuperuserRoute) {
      return NextResponse.redirect(new URL('/superuser/login', request.url));
    } else if (isAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  try {
    // Parse auth cookie
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.token) {
      throw new Error('Invalid auth token');
    }
    
    // For admin routes, check if user is admin
    if (isAdminRoute) {
      const user = authData.model;
      
      if (!user || user.userType !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
    
    // For superuser routes, check if user has superuser token
    if (isSuperuserRoute) {
      const superuserToken = request.cookies.get('pocketbase_superuser_token');
      
      if (!superuserToken) {
        return NextResponse.redirect(new URL('/superuser/login', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    // Redirect to login page on error
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else if (isSuperuserRoute) {
      return NextResponse.redirect(new URL('/superuser/login', request.url));
    } else if (isAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  }
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/superuser/:path*',
    '/account/:path*',
    '/shop/create',
    '/shop/edit/:path*',
  ],
};
