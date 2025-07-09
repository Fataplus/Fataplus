/*
import { requireAdmin } from '~/server/utils/auth-middleware'
import Database from 'better-sqlite3'

export default defineEventHandler(async (event) => {
  try {
    // Require admin authentication
    const currentUser = await requireAdmin(event)
    
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string || ''
    const role = query.role as string || ''
    const offset = (page - 1) * limit

    const sqlite = new Database('./server/database/sqlite.db')
    
    try {
      // Build WHERE clause
      let whereConditions = []
      let params: any[] = []
      
      if (search) {
        whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)')
        params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      }
      
      if (role) {
        whereConditions.push('role = ?')
        params.push(role)
      }
      
      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : ''

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`
      const { total } = sqlite.prepare(countQuery).get(...params) as { total: number }

      // Get users
      const usersQuery = `
        SELECT id, email, first_name, last_name, role, email_verified, last_login_at, created_at, updated_at
        FROM users 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `
      
      const users = sqlite.prepare(usersQuery).all(...params, limit, offset)

      return {
        success: true,
        data: {
          users: users.map(user => ({
            ...user,
            name: `${user.first_name} ${user.last_name}`,
            isVerified: !!user.email_verified,
            lastLoginAt: user.last_login_at ? new Date(user.last_login_at) : null,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at)
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          },
          filters: {
            search,
            role
          }
        },
        requestedBy: {
          id: currentUser.id,
          role: currentUser.role
        }
      }
      
    } finally {
      sqlite.close()
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch users'
    })
  }
})
*/
