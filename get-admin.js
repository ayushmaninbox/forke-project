import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })


async function run() {
  try {
    const { db } = await import('./lib/db')
    const { admins, users, owners } = await import('./lib/db/schema')
    const list = await db.select().from(admins)
    console.log('Admins in DB:', list)
    
    const userList = await db.select().from(users)
    console.log('Users in DB:', userList)
    
    const ownerList = await db.select().from(owners)
    console.log('Owners in DB:', ownerList)
    
    process.exit(0)
  } catch (err) {
    console.error('Failed:', err)
    process.exit(1)
  }
}
run()
