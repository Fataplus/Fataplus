import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

// Initialize PocketBase on the server
const initPocketBase = () => {
  const pocketbaseUrl = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
  return new PocketBase(pocketbaseUrl);
};

// Helper function to authenticate admin
const authenticateAdmin = async (pb: PocketBase) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not configured');
  }
  
  await pb.admins.authWithPassword(adminEmail, adminPassword);
  return pb;
};

export async function GET(request: NextRequest) {
  try {
    const pb = initPocketBase();
    const url = new URL(request.url);
    const collection = url.searchParams.get('collection');
    const id = url.searchParams.get('id');
    const filter = url.searchParams.get('filter');
    
    if (!collection) {
      return NextResponse.json({ error: 'Collection parameter is required' }, { status: 400 });
    }
    
    let data;
    if (id) {
      // Get a specific record
      data = await pb.collection(collection).getOne(id);
    } else {
      // Get a list of records
      const options: any = { sort: '-created' };
      if (filter) {
        options.filter = filter;
      }
      data = await pb.collection(collection).getList(1, 50, options);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pb = initPocketBase();
    const url = new URL(request.url);
    const collection = url.searchParams.get('collection');
    
    if (!collection) {
      return NextResponse.json({ error: 'Collection parameter is required' }, { status: 400 });
    }
    
    const body = await request.json();
    const data = await pb.collection(collection).create(body);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const pb = initPocketBase();
    const url = new URL(request.url);
    const collection = url.searchParams.get('collection');
    const id = url.searchParams.get('id');
    
    if (!collection || !id) {
      return NextResponse.json({ error: 'Collection and ID parameters are required' }, { status: 400 });
    }
    
    const body = await request.json();
    const data = await pb.collection(collection).update(id, body);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pb = initPocketBase();
    const url = new URL(request.url);
    const collection = url.searchParams.get('collection');
    const id = url.searchParams.get('id');
    
    if (!collection || !id) {
      return NextResponse.json({ error: 'Collection and ID parameters are required' }, { status: 400 });
    }
    
    await pb.collection(collection).delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.status || 500 }
    );
  }
}
