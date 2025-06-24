#!/usr/bin/env node

import { createDefaultSuperAdmin, createSuperAdmin } from '../server/database/seeds/create-superadmin'

// Parse command line arguments
const args = process.argv.slice(2)

async function main() {
  console.log('🔧 Fataplus SuperAdmin Setup')
  console.log('=' .repeat(50))
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  npm run create-superadmin              # Create default superadmin
  npm run create-superadmin --custom     # Create custom superadmin (interactive)
  
Default SuperAdmin:
  📧 Email: admin@fata.plus
  🔐 Password: FataPlus2025@Admin
  
Options:
  --help, -h     Show this help message
  --custom       Create custom superadmin with interactive prompts
`)
    return
  }

  if (args.includes('--custom')) {
    // Interactive mode for custom superadmin
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const question = (query: string): Promise<string> => {
      return new Promise(resolve => {
        rl.question(query, resolve)
      })
    }

    try {
      console.log('\n📝 Creating custom SuperAdmin...')
      const email = await question('📧 Email: ')
      const password = await question('🔐 Password: ')
      const firstName = await question('👤 First Name: ')
      const lastName = await question('👤 Last Name: ')
      const phone = await question('📱 Phone (optional): ')

      if (!email || !password || !firstName || !lastName) {
        console.log('❌ All required fields must be filled!')
        rl.close()
        return
      }

      const result = await createSuperAdmin({
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined
      })

      if (result.success) {
        console.log('\n🎉 Custom SuperAdmin created successfully!')
      } else {
        console.log(`\n❌ Failed to create SuperAdmin: ${result.message}`)
      }
    } catch (error) {
      console.error('❌ Error in interactive mode:', error)
    } finally {
      rl.close()
    }
  } else {
    // Default mode
    await createDefaultSuperAdmin()
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
}) 