# 🔐 SuperAdmin System - Fataplus

Complete guide for managing the SuperAdmin system in your Fataplus agricultural platform.

## 🚀 Quick Start

### 1. Create Your First SuperAdmin

```bash
# Install dependencies first
npm install

# Create default superadmin
npm run create-superadmin

# Or create custom superadmin (interactive)
npm run create-superadmin --custom
```

**Default SuperAdmin Credentials:**
- 📧 **Email**: `admin@fata.plus`
- 🔐 **Password**: `FataPlus2025@Admin`
- ⚠️ **IMPORTANT**: Change password after first login!

### 2. Login to Admin Dashboard

1. Navigate to: `/auth/login`
2. Login with superadmin credentials
3. You'll be redirected to: `/admin/dashboard`

## 🏗️ Role Hierarchy

```
SuperAdmin (Level 5) ← Highest privilege
    ↓
  Admin (Level 4)
    ↓
  Farmer (Level 3)
    ↓
  Vendor (Level 2)
    ↓
  User (Level 1) ← Lowest privilege
```

### Role Permissions

| Action | SuperAdmin | Admin | Farmer | Vendor | User |
|--------|:----------:|:-----:|:------:|:------:|:----:|
| Create SuperAdmin | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ✅* | ❌ | ❌ | ❌ |
| View All Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Access Admin Panel | ✅ | ✅ | ❌ | ❌ | ❌ |

*Admin can manage everyone except SuperAdmins

## 🔗 API Endpoints

### Authentication Headers
All admin endpoints require authentication:
```http
Authorization: Bearer <your-jwt-token>
```

### 👥 User Management

#### List All Users
```http
GET /api/admin/users
?page=1&limit=20&search=rakoto&role=farmer
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### Update User Role
```http
PATCH /api/admin/users/{userId}/role
Content-Type: application/json

{
  "newRole": "admin"
}
```

**Allowed roles**: `user`, `farmer`, `vendor`, `admin`, `superadmin`

### 📊 System Statistics

#### Role Distribution
```http
GET /api/admin/system/roles
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roleDistribution": [
      { "role": "superadmin", "count": 1, "percentage": 2 },
      { "role": "admin", "count": 3, "percentage": 5 },
      { "role": "farmer", "count": 45, "percentage": 75 }
    ],
    "systemHealth": {
      "superAdminExists": true,
      "totalAdmins": 3,
      "databaseConnected": true
    }
  }
}
```

## 🛡️ Security Features

### 1. **Protected Routes**
- Admin routes require authentication + admin role
- SuperAdmin routes require superadmin role specifically
- Role hierarchy prevents privilege escalation

### 2. **Last SuperAdmin Protection**
- Cannot demote the last remaining SuperAdmin
- System always maintains at least one SuperAdmin

### 3. **Audit Trail**
- All role changes are logged
- Include timestamp, previous role, new role, and who made the change

### 4. **Token Security**
- JWT tokens with configurable expiration
- Tokens include user ID and role information

## 🔧 Development & Deployment

### Local Development

```bash
# 1. Start development server
npm run dev

# 2. Create superadmin (if not exists)
npm run create-superadmin

# 3. Access admin panel
# http://localhost:3000/admin
```

### Production Deployment

```bash
# 1. Deploy to production
npm run deploy

# 2. Create superadmin on production
# Run the create-superadmin script on your server
```

## 📱 Frontend Integration

### Check User Role in Components

```vue
<template>
  <div v-if="userRole === 'superadmin'">
    <button @click="promoteToAdmin">Promote to Admin</button>
  </div>
</template>

<script setup>
const { data: user } = await $fetch('/api/auth/me')
const userRole = user?.role
</script>
```

### Protect Admin Routes

```typescript
// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { data: user } = await $fetch('/api/auth/me')
  
  if (!['admin', 'superadmin'].includes(user?.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }
})
```

## 🚨 Troubleshooting

### SuperAdmin Creation Fails

```bash
# Check if database exists
ls -la server/database/sqlite.db

# Check database permissions
chmod 664 server/database/sqlite.db

# Recreate superadmin
npm run create-superadmin
```

### Cannot Access Admin Panel

1. **Check Authentication**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:3000/api/auth/me
   ```

2. **Verify Role**:
   - Make sure user has `admin` or `superadmin` role
   - Check `/api/admin/system/roles` for role distribution

3. **Check Logs**:
   - Look for authentication errors in server logs
   - Verify JWT token is valid and not expired

### Database Issues

```bash
# Check database schema
npm run db:studio

# Run migrations if needed
npm run db:migrate
```

## 🔄 Common Tasks

### Promote User to Admin

```bash
# 1. Get user ID from admin panel or API
curl "/api/admin/users?search=user@email.com"

# 2. Update role (SuperAdmin only)
curl -X PATCH "/api/admin/users/{userId}/role" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"newRole": "admin"}'
```

### Create Additional SuperAdmin

```bash
# Only existing SuperAdmin can create another SuperAdmin
curl -X PATCH "/api/admin/users/{userId}/role" \
     -H "Authorization: Bearer SUPERADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"newRole": "superadmin"}'
```

### View System Health

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "/api/admin/system/roles"
```

## 📞 Support

For technical support or questions about the SuperAdmin system:

- 📧 **Email**: admin@fata.plus
- 🌐 **Production**: https://fataplus-app.fenohery.workers.dev
- 📖 **Documentation**: `/docs/SUPERADMIN.md`

---

**⚠️ Security Notice**: Always use strong passwords and change default credentials in production! 