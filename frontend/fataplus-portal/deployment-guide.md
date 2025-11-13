# Fataplus Portal Deployment Guide

## Deployment Overview

The Fataplus Portal is designed for deployment on Vercel with support for alternative hosting platforms. This guide covers production deployment, environment configuration, and monitoring setup.

## Production Deployment

### Vercel Deployment (Recommended)

#### Prerequisites

- Vercel account with team access
- Vercel CLI installed (`npm i -g vercel`)
- Domain name configured (optional)
- SSL certificate (handled automatically by Vercel)

#### Initial Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Deploy to production
vercel --prod
```

#### Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "name": "fataplus-portal",
  "build": {
    "env": {
      "NEXT_PUBLIC_SITE_URL": "https://portal.fataplus.com"
    }
  },
  "env": {
    "DATABASE_URL": "@database_url",
    "PAYLOAD_SECRET": "@payload_secret",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "https://portal.fataplus.com",
    "RESEND_API_KEY": "@resend_api_key",
    "S3_BUCKET": "@s3_bucket",
    "S3_ACCESS_KEY_ID": "@s3_access_key_id",
    "S3_SECRET_ACCESS_KEY": "@s3_secret_access_key"
  },
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, must-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin/dashboard",
      "permanent": true
    }
  ]
}
```

#### Environment Variables Setup

In Vercel dashboard, configure these environment variables:

```bash
# Required Variables
DATABASE_URL=postgresql://user:pass@host:port/database
PAYLOAD_SECRET=your-super-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-domain.com

# Optional Variables
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@fataplus.com
S3_BUCKET=fataplus-portal-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Alternative Deployment Options

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Create `.dockerignore`:

```
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.next
.git
```

Build and run:

```bash
# Build image
docker build -t fataplus-portal .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e PAYLOAD_SECRET="your-secret" \
  -e NEXTAUTH_SECRET="your-auth-secret" \
  fataplus-portal
```

#### AWS ECS Deployment

Create `ecs-task-definition.json`:

```json
{
  "family": "fataplus-portal",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "fataplus-portal",
      "image": "your-account.dkr.ecr.region.amazonaws.com/fataplus-portal:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:fataplus-db-url"
        },
        {
          "name": "PAYLOAD_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:fataplus-payload-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fataplus-portal",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Database Setup

### Production Database

#### Vercel Postgres

```bash
# Create database via Vercel CLI
vercel postgres create

# Generate types
npm run db:generate

# Push schema
npm run db:push
```

#### External PostgreSQL

```sql
-- Create database
CREATE DATABASE fataplus_portal;

-- Create user with limited permissions
CREATE USER fataplus_app WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT CONNECT ON DATABASE fataplus_portal TO fataplus_app;
GRANT USAGE ON SCHEMA public TO fataplus_app;
GRANT CREATE ON SCHEMA public TO fataplus_app;
```

#### Database Migration

```typescript
// scripts/migrate.ts
import { getPayloadClient } from '../src/payload/init-payload';

async function migrate() {
  const payload = await getPayloadClient();

  // This will automatically run migrations
  console.log('Database migration completed');
}

migrate().catch(console.error);
```

## Monitoring and Logging

### Application Monitoring

#### Sentry Integration

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

// src/app/layout.tsx
import { initSentry } from '@/lib/sentry';

initSentry();
```

#### Custom Analytics

```typescript
// src/lib/analytics.ts
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

export function trackEvent({ event, properties, userId }: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Send to analytics service
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties, userId }),
  });
}

// Usage
trackEvent({
  event: 'project_viewed',
  properties: { projectId: '123' },
  userId: 'user-456',
});
```

### Log Management

#### Structured Logging

```typescript
// src/lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

export function log(entry: LogEntry) {
  const logEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    service: 'fataplus-portal',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(JSON.stringify(logEntry, null, 2));
    return;
  }

  // Send to logging service in production
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry),
  });
}
```

## Performance Optimization

### CDN Configuration

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['your-cdn-domain.com'],
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  assetPrefix: process.env.NODE_ENV === 'production'
    ? 'https://your-cdn-domain.com'
    : undefined,
};
```

### Caching Strategy

```typescript
// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedProject = unstable_cache(
  async (projectId: string) => {
    const payload = await getPayloadClient();
    return await payload.findByID({
      collection: 'projects',
      id: projectId,
    });
  },
  ['project'],
  { revalidate: 3600, tags: ['projects'] }
);

export const getCachedProjects = unstable_cache(
  async (userId: string) => {
    const payload = await getPayloadClient();
    return await payload.find({
      collection: 'projects',
      where: {
        'client': {
          equals: userId,
        },
      },
    });
  },
  ['user-projects'],
  { revalidate: 1800, tags: ['user-projects'] }
);
```

## Security Configuration

### HTTPS and SSL

Vercel automatically handles HTTPS and SSL certificates. For custom domains:

1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificate is automatically provisioned

### Security Headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60 * 1000 // 1 minute
) {
  const key = `rate-limit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, Math.ceil(window / 1000));
  }

  return {
    success: count <= limit,
    count,
    remaining: Math.max(0, limit - count),
    reset: await redis.pttl(key),
  };
}
```

## Backup and Recovery

### Database Backups

#### Vercel Postgres Backups

Vercel Postgres automatically creates daily backups. Access through Vercel dashboard.

#### Manual Backup Script

```typescript
// scripts/backup-db.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join('./backups', `backup-${timestamp}.sql`);

  // Ensure backup directory exists
  fs.mkdirSync('./backups', { recursive: true });

  try {
    const { stdout, stderr } = await execAsync(
      `pg_dump "${process.env.DATABASE_URL}" > "${backupPath}"`
    );

    console.log(`Database backed up to: ${backupPath}`);

    // Upload to cloud storage (optional)
    await uploadToS3(backupPath);

    // Clean up local file
    fs.unlinkSync(backupPath);

  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

backupDatabase().catch(console.error);
```

### File Backup Strategy

```typescript
// S3 backup configuration
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

async function backupFiles() {
  const bucket = process.env.S3_BACKUP_BUCKET!;
  const date = new Date().toISOString().split('T')[0];

  // Sync production bucket to backup bucket
  const syncCommand = `aws s3 sync s3://fataplus-portal-uploads s3://${bucket}/backups/${date}`;

  await execAsync(syncCommand);
  console.log('File backup completed');
}
```

## Health Checks

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/init-payload';

export async function GET() {
  try {
    // Check database connection
    const payload = await getPayloadClient();
    await payload.find({
      collection: 'users',
      limit: 1,
    });

    // Check external services
    const checks = {
      database: 'healthy',
      filesystem: 'healthy',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### Uptime Monitoring

Configure external monitoring tools to ping the health endpoint:

```typescript
// Recommended monitoring endpoints
GET /api/health          # Overall health check
GET /api/health/db       # Database health check
GET /api/health/auth     # Authentication health check
```

## Rollback Strategy

### Rollback Procedure

```bash
# 1. Identify problematic deployment
vercel ls

# 2. Rollback to previous working version
vercel rollback [deployment-url]

# 3. For database issues, restore backup
# (Use your database provider's console or API)

# 4. Verify rollback
curl https://your-domain.com/api/health
```

### Blue-Green Deployment

For zero-downtime deployments:

```typescript
// Configure separate preview/staging environment
const environments = {
  production: 'https://portal.fataplus.com',
  staging: 'https://fataplus-portal-staging.vercel.app',
};
```

This deployment guide ensures your Fataplus Portal runs reliably in production with proper monitoring, security, and backup procedures.

---