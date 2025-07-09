/*
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import Database from 'better-sqlite3'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    // Validation
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Direct SQLite access for login
    const sqlite = new Database('./server/database/sqlite.db')
    const user = sqlite.prepare('SELECT * FROM users WHERE email = ?').get(email)
    sqlite.close()

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.authSecret,
      { expiresIn: '7d' }
    )

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return {
      data: {
        user: userWithoutPassword,
        token,
        autoLogin: true
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur serveur'
    })
  }
})
*/
