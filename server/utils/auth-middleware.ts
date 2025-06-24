import * as jwt from 'jsonwebtoken'
import Database from 'better-sqlite3'
import type { EventHandlerRequest, H3Event } from 'h3'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'superadmin' | 'admin' | 'farmer' | 'vendor' | 'user'
  isVerified: boolean
}

export interface AuthenticatedEvent extends H3Event<EventHandlerRequest> {
  context: {
    user: AuthUser
  }
}

/**
 * Extract and verify JWT token from request
 */
export async function verifyToken(event: H3Event): Promise<AuthUser | null> {
  try {
    const authHeader = getHeader(event, 'authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.authSecret) as any
    
    if (!decoded.userId) {
      return null
    }

    // Fetch user from database
    const sqlite = new Database('./server/database/sqlite.db')
    try {
      const user = sqlite.prepare(
        'SELECT id, email, name, role, is_verified FROM users WHERE id = ?'
      ).get(decoded.userId)
      
      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: !!user.is_verified
      }
    } finally {
      sqlite.close()
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const user = await verifyToken(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  // Attach user to event context
  event.context.user = user
  return user
}

/**
 * Middleware to require specific role
 */
export async function requireRole(
  event: H3Event, 
  allowedRoles: string[]
): Promise<AuthUser> {
  const user = await requireAuth(event)
  
  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient permissions'
    })
  }
  
  return user
}

/**
 * Middleware to require admin role (admin or superadmin)
 */
export async function requireAdmin(event: H3Event): Promise<AuthUser> {
  return requireRole(event, ['admin', 'superadmin'])
}

/**
 * Middleware to require superadmin role only
 */
export async function requireSuperAdmin(event: H3Event): Promise<AuthUser> {
  return requireRole(event, ['superadmin'])
}

/**
 * Check if user has permission to manage another user
 */
export function canManageUser(currentUser: AuthUser, targetRole: string): boolean {
  const roleHierarchy = {
    'superadmin': 5,
    'admin': 4,
    'farmer': 3,
    'vendor': 2,
    'user': 1
  }
  
  const currentUserLevel = roleHierarchy[currentUser.role] || 0
  const targetUserLevel = roleHierarchy[targetRole as keyof typeof roleHierarchy] || 0
  
  // SuperAdmin can manage everyone
  if (currentUser.role === 'superadmin') {
    return true
  }
  
  // Admin can manage everyone except superadmin
  if (currentUser.role === 'admin' && targetRole !== 'superadmin') {
    return true
  }
  
  // Users can only manage users with lower roles
  return currentUserLevel > targetUserLevel
}

/**
 * Helper to get current user from event context
 */
export function getCurrentUser(event: H3Event): AuthUser | null {
  return event.context.user || null
} 