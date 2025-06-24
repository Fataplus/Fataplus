import * as bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'

interface SuperAdminData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export async function createSuperAdmin(adminData: SuperAdminData) {
  const sqlite = new Database('./server/database/sqlite.db')
  
  try {
    // Check if superadmin already exists
    const existingSuperAdmin = sqlite.prepare(
      'SELECT id FROM users WHERE role = ?'
    ).get('superadmin')
    
    if (existingSuperAdmin) {
      console.log('⚠️  SuperAdmin already exists!')
      return { success: false, message: 'SuperAdmin already exists' }
    }

    // Check if email already exists
    const existingUser = sqlite.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).get(adminData.email)
    
    if (existingUser) {
      console.log('❌ User with this email already exists!')
      return { success: false, message: 'User with this email already exists' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12)
    const userId = randomUUID().replace(/-/g, '')
    const now = Date.now()

    // Create superadmin user
    const insertStmt = sqlite.prepare(`
      INSERT INTO users (
        id, email, name, role, password_hash, is_verified, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insertStmt.run(
      userId,
      adminData.email,
      `${adminData.firstName} ${adminData.lastName}`,
      'superadmin',
      hashedPassword,
      1, // Auto-verified
      now,
      now
    )

    console.log('🎉 SuperAdmin created successfully!')
    console.log(`📧 Email: ${adminData.email}`)
    console.log(`👤 Name: ${adminData.firstName} ${adminData.lastName}`)
    console.log(`🔐 Password: [HIDDEN]`)
    
    return { 
      success: true, 
      message: 'SuperAdmin created successfully',
      userId 
    }
    
  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error)
    return { 
      success: false, 
      message: `Error: ${error}` 
    }
  } finally {
    sqlite.close()
  }
}

// Default superadmin data for development
export const defaultSuperAdminData: SuperAdminData = {
  email: 'admin@fata.plus',
  password: 'FataPlus2025@Admin',
  firstName: 'Super',
  lastName: 'Admin',
  phone: '+261 34 12 345 67'
}

// CLI function to create superadmin
export async function createDefaultSuperAdmin() {
  console.log('🚀 Creating default SuperAdmin for Fataplus...')
  const result = await createSuperAdmin(defaultSuperAdminData)
  
  if (result.success) {
    console.log('✅ Setup complete! You can now login with:')
    console.log(`   📧 Email: ${defaultSuperAdminData.email}`)
    console.log(`   🔐 Password: ${defaultSuperAdminData.password}`)
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')
  }
  
  return result
} 