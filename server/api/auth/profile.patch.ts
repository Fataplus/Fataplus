/*
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
    const decoded = jwt.verify(token, config.authSecret) as { userId: string }
    
    const updates = await readBody(event)
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password
    delete updates.id
    delete updates.email
    delete updates.role
    
    // Update user
    const updatedUser = await db
      .update(users)
      .set({
        ...updates,
        updated_at: new Date().getTime()
      })
      .where(eq(users.id, decoded.userId))
      .returning()
      .get()

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return {
      data: userWithoutPassword
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la mise à jour'
    })
  }
})
*/
