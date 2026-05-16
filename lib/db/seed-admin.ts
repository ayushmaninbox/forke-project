const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

import bcrypt from 'bcryptjs'

async function seed() {
  const { db } = await import('./index')
  const { admins } = await import('./schema')
  const username = 'ayushmaninbox'
  const password = 'pupulu123'
  const passwordHash = await bcrypt.hash(password, 10)

  console.log('Seeding admin...')
  
  try {
    await db.insert(admins).values({
      username,
      passwordHash,
    }).onConflictDoNothing()
    
    console.log('Admin seeded successfully!')
  } catch (error) {
    console.error('Error seeding admin:', error)
  }
  
  process.exit(0)
}

seed()
