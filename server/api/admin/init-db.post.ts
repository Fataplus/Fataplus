import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    // Simple initialization endpoint for production
    console.log('🔧 Initializing database for production...')
    
    // Get database - use NuxtHub in production, local SQLite in development
    let db: any
    
    if (process.env.NODE_ENV === 'production') {
      // Import NuxtHub database at runtime
      const { hubDatabase } = await import('@nuxthub/core/runtime')
      db = hubDatabase()
    } else {
      // Development: Use local SQLite
      const Database = await import('better-sqlite3')
      const sqlite = new Database.default('./server/database/sqlite.db')
      db = {
        exec: (sql: string) => sqlite.exec(sql),
        prepare: (sql: string) => ({
          bind: (...params: any[]) => ({
            first: () => sqlite.prepare(sql).get(...params),
            run: () => sqlite.prepare(sql).run(...params)
          }),
          get: (...params: any[]) => sqlite.prepare(sql).get(...params),
          run: (...params: any[]) => sqlite.prepare(sql).run(...params)
        })
      }
    }
    
    // Create users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT,
        password TEXT,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        avatar TEXT,
        bio TEXT,
        location TEXT,
        role TEXT DEFAULT 'farmer' NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        email_verified INTEGER DEFAULT 0,
        two_factor_enabled INTEGER DEFAULT 0,
        preferences TEXT,
        last_login_at INTEGER,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      )
    `)
    
    // Create unique indexes
    await db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)`)
    await db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username)`)
    
    console.log('✅ Database tables created')
    
    // Check if SuperAdmin already exists
    const existingSuperAdmin = await db.prepare(
      'SELECT id FROM users WHERE role = ? LIMIT 1'
    ).bind('superadmin').first()
    
    if (existingSuperAdmin) {
      return {
        success: true,
        message: 'Database initialized - SuperAdmin already exists',
        data: {
          tables: 'created',
          superadmin: 'exists'
        }
      }
    }
    
    // Create SuperAdmin user
    const hashedPassword = await bcrypt.hash('FataPlus2025@Admin', 12)
    const userId = randomUUID().replace(/-/g, '')
    const now = Date.now()
    
    await db.prepare(`
      INSERT INTO users (
        id, email, first_name, last_name, phone, role, password, 
        email_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      'admin@fata.plus',
      'Super',
      'Admin',
      '+261 34 12 345 67',
      'superadmin',
      hashedPassword,
      1, // Auto-verified
      now,
      now
    ).run()
    
    console.log('🎉 SuperAdmin created successfully!')
    
    return {
      success: true,
      message: 'Database initialized and SuperAdmin created successfully',
      data: {
        tables: 'created',
        superadmin: 'created',
        credentials: {
          email: 'admin@fata.plus',
          password: 'FataPlus2025@Admin',
          note: 'Change password after first login!'
        }
      }
    }
    
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error)
    
    return {
      success: false,
      message: 'Database initialization failed',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}) 