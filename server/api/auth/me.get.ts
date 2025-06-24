import * as jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { users } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification requis'
      })
    }

    const token = authHeader.split(' ')[1]
    const config = useRuntimeConfig()
    
    // Verify JWT token
    const decoded = jwt.verify(token, config.authSecret) as { userId: string }
    
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .get()

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return {
      data: userWithoutPassword
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Token invalide'
    })
  }
}) 