import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

// Initialize PocketBase on the server
const initPocketBase = () => {
  const pocketbaseUrl = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
  return new PocketBase(pocketbaseUrl);
};

export async function POST(request: NextRequest) {
  try {
    const pb = initPocketBase();
    const { action, email, password } = await request.json();
    
    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }
    
    let data;
    
    switch (action) {
      case 'login':
        if (!email || !password) {
          return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        
        data = await pb.collection('users').authWithPassword(email, password);
        
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
        
        return NextResponse.json({
          user: data.record,
          token: data.token
        });
        
      case 'register':
        if (!email || !password) {
          return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        
        const userData = await request.json();
        data = await pb.collection('users').create(userData);
        
        // Auto login after registration
        await pb.collection('users').authWithPassword(email, password);
        
        // Set auth cookie
        const registerCookieStore = cookies();
        registerCookieStore.set('pb_auth', JSON.stringify({
          token: pb.authStore.token,
          model: pb.authStore.model
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/'
        });
        
        return NextResponse.json({
          user: data,
          token: pb.authStore.token
        });
        
      case 'logout':
        pb.authStore.clear();
        
        // Clear auth cookie
        const logoutCookieStore = cookies();
        logoutCookieStore.delete('pb_auth');
        
        return NextResponse.json({ success: true });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies();
    const authCookie = cookieStore.get('pb_auth');
    
    if (!authCookie) {
      return NextResponse.json({ authenticated: false });
    }
    
    try {
      const authData = JSON.parse(authCookie.value);
      
      if (!authData.token) {
        return NextResponse.json({ authenticated: false });
      }
      
      // Validate token
      const pb = initPocketBase();
      pb.authStore.save(authData.token, authData.model);
      
      if (!pb.authStore.isValid) {
        // Clear invalid auth cookie
        cookieStore.delete('pb_auth');
        return NextResponse.json({ authenticated: false });
      }
      
      return NextResponse.json({
        authenticated: true,
        user: pb.authStore.model
      });
    } catch (e) {
      // Clear invalid auth cookie
      cookieStore.delete('pb_auth');
      return NextResponse.json({ authenticated: false });
    }
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred', authenticated: false },
      { status: error.status || 500 }
    );
  }
}
