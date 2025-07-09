/*
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
    const body = await readBody(event)
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role = 'farmer',
      // Farmer-specific fields
      region,
      district, 
      commune,
      farmSize,
      crops,
      experience,
      interests
    } = body

    console.log('Registration data received:', { 
      email, 
      firstName, 
      lastName, 
      role, 
      region, 
      district, 
      commune,
      farmSize,
      crops: crops?.length 
    })

    // Validation
    if (!email || !password || !firstName || !lastName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, first name, and last name are required'
      })
    }

    // Farmer-specific validation
    if (role === 'farmer') {
      if (!region || !district || !commune) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Region, district, and commune are required for farmers'
        })
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Password validation
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
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
          statusMessage: 'User with this email already exists'
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

      // Create user profile for farmers with agricultural data
      if (role === 'farmer') {
        const profileId = randomUUID().replace(/-/g, '')
        
        const insertProfileStmt = sqlite.prepare(`
          INSERT INTO user_profiles (
            id, user_id, first_name, last_name, phone, region, district, commune,
            farm_size, crops, experience, interests, is_public, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        insertProfileStmt.run(
          profileId,
          userId,
          firstName,
          lastName,
          phone || null,
          region,
          district,
          commune,
          farmSize || null,
          crops ? JSON.stringify(crops) : null,
          experience || null,
          interests ? JSON.stringify(interests) : null,
          1, // is_public - farmers public by default for community
          Date.now(),
          Date.now()
        )

        console.log('✅ Farmer profile created with agricultural data')
      }

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
        message: role === 'farmer' 
          ? 'Compte agriculteur créé avec succès! Bienvenue dans la communauté Fataplus! 🌾'
          : 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: `${newUser.first_name} ${newUser.last_name}`,
            role: newUser.role,
            isVerified: Boolean(newUser.email_verified),
            isFarmer: role === 'farmer',
            hasProfile: role === 'farmer',
            region: role === 'farmer' ? region : null,
            createdAt: new Date(newUser.created_at)
          },
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
      statusMessage: error.statusMessage || 'Registration failed'
    })
  }
}) 
*/
