# Fataplus Portal Setup Guide

## Prerequisites

- **Node.js 18+** with npm or yarn
- **PostgreSQL** (local or cloud instance)
- **Git** for version control
- **VS Code** (recommended) with TypeScript extensions
- **Vercel CLI** (for deployment)

## Environment Setup

### 1. Clone and Initialize Project

```bash
# Clone the template repository
git clone https://github.com/dyad-sh/portal-mini-store-template fataplus-portal
cd fataplus-portal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Environment Configuration

Edit `.env.local` with your specific configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fataplus_portal"

# Payload CMS
PAYLOAD_SECRET="your-super-secret-key-here"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@fataplus.com"

# File Upload
S3_BUCKET="fataplus-portal-uploads"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-s3-access-key"
S3_SECRET_ACCESS_KEY="your-s3-secret-key"
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb fataplus_portal

# Run database migrations (will be created later)
npm run db:push
```

## Initial Configuration

### 1. Customize Payload CMS Collections

Navigate to `src/payload/collections/` and modify the existing collections:

#### Users Collection Enhancement

```typescript
// src/payload/collections/Users.ts
import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Project Manager', value: 'project-manager' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'client',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
  ],
};
```

#### Projects Collection (Replace Orders)

```typescript
// src/payload/collections/Projects.ts
import { CollectionConfig } from 'payload/types';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'projectName',
  },
  fields: [
    {
      name: 'projectName',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Intake', value: 'intake' },
        { label: 'Planning', value: 'planning' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Review', value: 'review' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'intake',
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'projectManager',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'expectedDelivery',
      type: 'date',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
  ],
};
```

#### Documents Collection

```typescript
// src/payload/collections/Documents.ts
import { CollectionConfig } from 'payload/types';

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'PRD', value: 'prd' },
        { label: 'TDR', value: 'tdr' },
        { label: 'Contract', value: 'contract' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0',
    },
    {
      name: 'accessLevel',
      type: 'select',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Internal', value: 'internal' },
        { label: 'Public', value: 'public' },
      ],
      defaultValue: 'client',
    },
  ],
};
```

### 2. Update Next.js Configuration

Modify `next.config.ts`:

```typescript
import type { NextConfig } from 'next';
import { Payload } from 'payload';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['payload'],
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin',
      },
    ];
  },
};

export default nextConfig;
```

### 3. Authentication Configuration

Update or create `src/payload/init-payload.ts`:

```typescript
import payload from 'payload';
import { payloadConfig } from './payload/config';

let cached = global.payload;

if (!cached) {
  cached = global.payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: any;
}

export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<any> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing');
  }

  if (cached.client) {
    return cached.client;
  }

  cached.promise = payload.init({
    ...payloadConfig,
    local: initOptions?.local ?? false,
    secret: process.env.PAYLOAD_SECRET || '',
  });

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate  # Generate TypeScript types
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
```

## Initial Admin User Setup

1. Navigate to `http://localhost:3000/admin`
2. Create your first admin account
3. Set up initial clients and projects through the admin panel

## Integration Points

### Intake Form Integration

Create webhook endpoint in `src/app/api/webhooks/intake/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/init-payload';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = await getPayloadClient();

    // Create or update client
    const client = await payload.create({
      collection: 'users',
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        company: body.company,
        role: 'client',
      },
    });

    // Create project
    const project = await payload.create({
      collection: 'projects',
      data: {
        projectName: body.projectName,
        client: client.id,
        status: 'planning',
        description: body.description,
      },
    });

    return NextResponse.json({ success: true, projectId: project.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Payload Admin Not Loading**
   - Verify PAYLOAD_SECRET is set
   - Check for missing environment variables
   - Restart development server

3. **File Upload Issues**
   - Configure S3 credentials
   - Check bucket permissions
   - Verify file size limits

### Development Tips

- Use `npm run dev` for hot reloading
- Check browser console for errors
- Verify database schema after collection changes
- Test authentication flow regularly

---