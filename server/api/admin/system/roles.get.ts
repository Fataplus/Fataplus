import { requireAdmin } from '~/server/utils/auth-middleware'
import Database from 'better-sqlite3'

export default defineEventHandler(async (event) => {
  try {
    // Require admin authentication
    const currentUser = await requireAdmin(event)
    
    const sqlite = new Database('./server/database/sqlite.db')
    
    try {
      // Get role distribution
      const roleStats = sqlite.prepare(`
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role 
        ORDER BY 
          CASE role 
            WHEN 'superadmin' THEN 1 
            WHEN 'admin' THEN 2 
            WHEN 'farmer' THEN 3 
            WHEN 'vendor' THEN 4 
            WHEN 'user' THEN 5 
            ELSE 6 
          END
      `).all()

      // Get user activity stats
      const activityStats = sqlite.prepare(`
        SELECT 
          COUNT(*) as totalUsers,
          COUNT(CASE WHEN is_verified = 1 THEN 1 END) as verifiedUsers,
          COUNT(CASE WHEN last_login_at IS NOT NULL THEN 1 END) as activeUsers,
          COUNT(CASE WHEN created_at > ? THEN 1 END) as newUsersThisMonth
        FROM users
      `).get(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

      // Get recent registrations
      const recentRegistrations = sqlite.prepare(`
        SELECT id, email, name, role, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 10
      `).all()

      // Check system health
      const systemHealth = {
        superAdminExists: roleStats.some(stat => stat.role === 'superadmin' && stat.count > 0),
        totalAdmins: roleStats.find(stat => stat.role === 'admin')?.count || 0,
        totalSuperAdmins: roleStats.find(stat => stat.role === 'superadmin')?.count || 0,
        databaseConnected: true, // If we got here, DB is working
        timestamp: new Date()
      }

      return {
        success: true,
        data: {
          roleDistribution: roleStats.map(stat => ({
            role: stat.role,
            count: stat.count,
            percentage: Math.round((stat.count / activityStats.totalUsers) * 100)
          })),
          activity: {
            ...activityStats,
            verificationRate: Math.round((activityStats.verifiedUsers / activityStats.totalUsers) * 100),
            activityRate: Math.round((activityStats.activeUsers / activityStats.totalUsers) * 100)
          },
          recentRegistrations: recentRegistrations.map(user => ({
            ...user,
            createdAt: new Date(user.created_at)
          })),
          systemHealth,
          permissions: {
            canCreateSuperAdmin: currentUser.role === 'superadmin',
            canCreateAdmin: currentUser.role === 'superadmin',
            canViewAllUsers: ['superadmin', 'admin'].includes(currentUser.role),
            canModifyRoles: currentUser.role === 'superadmin'
          }
        },
        requestedBy: {
          id: currentUser.id,
          role: currentUser.role,
          timestamp: new Date()
        }
      }
      
    } finally {
      sqlite.close()
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch role statistics'
    })
  }
}) 