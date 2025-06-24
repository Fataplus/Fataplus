import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'

// Simple ID generation function
function generateId(): string {
  return randomUUID().replace(/-/g, '')
}

export default defineEventHandler(async (event) => {
  try {
    console.log('Registration attempt started')
    const { email, password, firstName, lastName, phone, role = 'farmer' } = await readBody(event)
    console.log('Registration data received:', { email, firstName, lastName, role })

    // Validation
    if (!email || !password || !firstName || !lastName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs obligatoires doivent être remplis'
      })
    }

    // Direct SQLite access for registration
    console.log('Opening database connection')
    const sqlite = new Database('./server/database/sqlite.db')
    
    try {
      // Check if user already exists
      console.log('Checking for existing user with email:', email)
      const existingUser = sqlite.prepare('SELECT id FROM users WHERE email = ?').get(email)
      if (existingUser) {
        console.log('User already exists')
        throw createError({
          statusCode: 409,
          statusMessage: 'Un compte avec cet email existe déjà'
        })
      }

      // Hash password
      console.log('Hashing password')
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user with only essential fields (let DB handle defaults)
      console.log('Generating user ID')
      const userId = generateId()
      console.log('Generated user ID:', userId)
      
      console.log('Preparing insert statement')
      const insertStmt = sqlite.prepare(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      console.log('Executing insert with data:', { userId, email, firstName, lastName, phone, role })
      insertStmt.run(
        userId,
        email,
        hashedPassword,
        firstName,
        lastName,
        phone || null,
        role
      )
      console.log('Insert completed')

      // Get the created user
      console.log('Fetching created user')
      const newUser = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(userId)
      console.log('User created successfully:', newUser ? 'yes' : 'no')

      if (!newUser) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur lors de la création du compte'
        })
      }

      // Generate JWT token for auto-login
      console.log('Generating JWT token')
      const config = useRuntimeConfig()
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        config.authSecret,
        { expiresIn: '7d' }
      )

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser

      console.log('Registration successful')
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
          autoLogin: true
        }
      }
    } catch (dbError: any) {
      console.error('Database error during registration:', dbError)
      throw dbError
    } finally {
      console.log('Closing database connection')
      sqlite.close()
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de l\'inscription'
    })
  }
}) 