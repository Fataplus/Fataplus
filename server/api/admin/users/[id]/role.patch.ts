import { requireSuperAdmin, canManageUser } from '~/server/utils/auth-middleware'
import Database from 'better-sqlite3'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id')
    const { newRole } = await readBody(event)
    
    if (!userId || !newRole) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID and new role are required'
      })
    }

    // Validate role
    const validRoles = ['user', 'farmer', 'vendor', 'admin', 'superadmin']
    if (!validRoles.includes(newRole)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role specified'
      })
    }

    // For promoting to admin or superadmin, require superadmin
    if (newRole === 'admin' || newRole === 'superadmin') {
      await requireSuperAdmin(event)
    } else {
      // For other roles, require at least admin
      await requireAdmin(event)
    }

    const currentUser = event.context.user
    const sqlite = new Database('./server/database/sqlite.db')
    
    try {
      // Get target user
      const targetUser = sqlite.prepare(
        'SELECT id, email, name, role FROM users WHERE id = ?'
      ).get(userId)
      
      if (!targetUser) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found'
        })
      }

      // Check if current user can manage target user
      if (!canManageUser(currentUser, targetUser.role)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Insufficient permissions to modify this user'
        })
      }

      // Prevent demoting the last superadmin
      if (targetUser.role === 'superadmin' && newRole !== 'superadmin') {
        const superAdminCount = sqlite.prepare(
          'SELECT COUNT(*) as count FROM users WHERE role = ?'
        ).get('superadmin') as { count: number }
        
        if (superAdminCount.count <= 1) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Cannot demote the last superadmin'
          })
        }
      }

      // Update user role
      const updateStmt = sqlite.prepare(
        'UPDATE users SET role = ?, updated_at = ? WHERE id = ?'
      )
      
      updateStmt.run(newRole, Date.now(), userId)

      // Get updated user
      const updatedUser = sqlite.prepare(
        'SELECT id, email, name, role, is_verified, created_at, updated_at FROM users WHERE id = ?'
      ).get(userId)

      // Log the role change
      console.log(`🔄 Role Change: User ${targetUser.email} changed from ${targetUser.role} to ${newRole} by ${currentUser.email}`)

      return {
        success: true,
        message: `User role updated successfully from ${targetUser.role} to ${newRole}`,
        data: {
          user: {
            ...updatedUser,
            isVerified: !!updatedUser.is_verified,
            createdAt: new Date(updatedUser.created_at),
            updatedAt: new Date(updatedUser.updated_at)
          }
        },
        changelog: {
          action: 'role_updated',
          previousRole: targetUser.role,
          newRole,
          updatedBy: {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role
          },
          timestamp: new Date()
        }
      }
      
    } finally {
      sqlite.close()
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update user role'
    })
  }
}) 