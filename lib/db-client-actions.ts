'use server'

import { db, client } from './db'
import { sql } from 'drizzle-orm'
import { getCurrentAdmin, isAdminAuthenticated } from './admin-actions'

// Helper to check standard admin authentication
async function ensureAdmin() {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    throw new Error('Unauthorized')
  }
}

// Helper to check super admin authentication for mutations
async function ensureSuperAdmin() {
  await ensureAdmin()
  const admin = await getCurrentAdmin()
  if (!admin || admin.role !== 'super_admin') {
    throw new Error('Unauthorized: Only Super Admins have database manipulation overrides.')
  }
}

// 1. Validate if a table name exists in the public schema to prevent SQL Injection
async function validateTableName(tableName: string): Promise<string> {
  const result: any = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = ${tableName}
      AND table_type = 'BASE TABLE'
    LIMIT 1;
  `)
  if (result.length === 0) {
    throw new Error(`Access Denied: Invalid or protected table name "${tableName}"`)
  }
  return tableName
}

// 2. Fetch all public base tables in the database
export async function getDatabaseTables() {
  await ensureAdmin()
  try {
    const result: any = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    return { 
      success: true, 
      tables: result.map((row: any) => row.table_name as string)
    }
  } catch (error: any) {
    console.error('Failed to get database tables:', error)
    return { success: false, error: error.message || 'Failed to list tables.' }
  }
}

// 3. Fetch detailed table structure (columns, types, default values, nullability, primary keys)
export async function getTableDetails(tableName: string) {
  await ensureAdmin()
  try {
    const validTable = await validateTableName(tableName)

    // Fetch column details
    const columnsResult: any = await db.execute(sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = ${validTable}
      ORDER BY ordinal_position;
    `)

    // Fetch primary key columns
    const pkResult: any = await db.execute(sql`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY' 
        AND tc.table_name = ${validTable};
    `)

    const primaryKeys = pkResult.map((row: any) => row.column_name as string)

    const columns = columnsResult.map((row: any) => ({
      name: row.column_name as string,
      type: row.data_type as string,
      nullable: row.is_nullable === 'YES',
      defaultVal: row.column_default as string | null,
      isPrimaryKey: primaryKeys.includes(row.column_name as string)
    }))

    return { success: true, columns, primaryKeys }
  } catch (error: any) {
    console.error(`Failed to get details for table ${tableName}:`, error)
    return { success: false, error: error.message || 'Failed to fetch table structure.' }
  }
}

// 4. Fetch table records dynamically with pagination, sorting, and simple filtering
export async function getTableData(
  tableName: string, 
  options: { 
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filterColumn?: string
    filterValue?: string
  }
) {
  await ensureAdmin()
  try {
    const validTable = await validateTableName(tableName)
    const page = Math.max(1, options.page)
    const limit = Math.max(1, Math.min(100, options.limit))
    const offset = (page - 1) * limit

    // Validate and sanitize sort column if provided
    let sortSql = ''
    if (options.sortBy) {
      const isColValid: any = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = ${validTable} 
          AND column_name = ${options.sortBy}
        LIMIT 1;
      `)
      if (isColValid.length > 0) {
        const order = options.sortOrder === 'desc' ? 'DESC' : 'ASC'
        sortSql = `ORDER BY "${options.sortBy}" ${order}`
      }
    }

    // Validate and sanitize filter column if provided
    let whereSql = ''
    const params: any[] = []
    if (options.filterColumn && options.filterValue !== undefined && options.filterValue.trim() !== '') {
      const isColValid: any = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = ${validTable} 
          AND column_name = ${options.filterColumn}
        LIMIT 1;
      `)
      if (isColValid.length > 0) {
        whereSql = `WHERE CAST("${options.filterColumn}" AS TEXT) ILIKE $1`
        params.push(`%${options.filterValue.trim()}%`)
      }
    }

    // Count query
    const countQuery = `SELECT count(*)::int FROM public."${validTable}" ${whereSql}`
    const countResult = await client.unsafe(countQuery, params)
    const totalRecords = countResult[0]?.count ?? 0

    // Select query
    params.push(limit, offset)
    const dataQuery = `
      SELECT * 
      FROM public."${validTable}" 
      ${whereSql} 
      ${sortSql} 
      LIMIT $${params.length - 1} 
      OFFSET $${params.length}
    `
    const rows = await client.unsafe(dataQuery, params)

    return { 
      success: true, 
      rows: Array.from(rows), 
      totalRecords 
    }
  } catch (error: any) {
    console.error(`Failed to get data for table ${tableName}:`, error)
    return { success: false, error: error.message || 'Failed to fetch table records.' }
  }
}

// 5. Insert a new record into a table (restricted to super_admin)
export async function insertTableRecord(tableName: string, record: Record<string, any>) {
  await ensureSuperAdmin()
  try {
    const validTable = await validateTableName(tableName)

    // Fetch and validate active columns
    const columnsResult: any = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = ${validTable};
    `)
    const validColumns = columnsResult.map((row: any) => row.column_name as string)

    const columnsToInsert: string[] = []
    const valuesToInsert: any[] = []

    for (const [key, value] of Object.entries(record)) {
      if (validColumns.includes(key)) {
        columnsToInsert.push(`"${key}"`)
        // Handle empty strings for numbers/dates by setting to null
        if (value === '') {
          valuesToInsert.push(null)
        } else {
          valuesToInsert.push(value)
        }
      }
    }

    if (columnsToInsert.length === 0) {
      return { success: false, error: 'No valid columns provided for insertion.' }
    }

    const columnsList = columnsToInsert.join(', ')
    const placeholdersList = columnsToInsert.map((_, i) => `$${i + 1}`).join(', ')
    const queryText = `INSERT INTO public."${validTable}" (${columnsList}) VALUES (${placeholdersList}) RETURNING *`

    const inserted = await client.unsafe(queryText, valuesToInsert)
    return { success: true, record: inserted[0] }
  } catch (error: any) {
    console.error(`Failed to insert record in table ${tableName}:`, error)
    return { success: false, error: error.message || 'Failed to insert record.' }
  }
}

// 6. Update cell-level fields in a record (restricted to super_admin)
export async function updateTableRecord(
  tableName: string, 
  primaryKeyName: string, 
  primaryKeyValue: any, 
  updatedFields: Record<string, any>
) {
  await ensureSuperAdmin()
  try {
    const validTable = await validateTableName(tableName)

    // Fetch and validate columns
    const columnsResult: any = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = ${validTable};
    `)
    const validColumns = columnsResult.map((row: any) => row.column_name as string)

    if (!validColumns.includes(primaryKeyName)) {
      return { success: false, error: `Invalid primary key column name: ${primaryKeyName}` }
    }

    const setClauses: string[] = []
    const params: any[] = [primaryKeyValue] // $1 is the primary key value

    for (const [key, value] of Object.entries(updatedFields)) {
      if (validColumns.includes(key) && key !== primaryKeyName) {
        params.push(value === '' ? null : value)
        setClauses.push(`"${key}" = $${params.length}`)
      }
    }

    if (setClauses.length === 0) {
      return { success: false, error: 'No fields to update.' }
    }

    const queryText = `
      UPDATE public."${validTable}" 
      SET ${setClauses.join(', ')} 
      WHERE "${primaryKeyName}" = $1 
      RETURNING *
    `

    const updated = await client.unsafe(queryText, params)
    return { success: true, record: updated[0] }
  } catch (error: any) {
    console.error(`Failed to update record in table ${tableName}:`, error)
    return { success: false, error: error.message || 'Failed to update record.' }
  }
}

// 7. Delete multiple records in a table (restricted to super_admin)
export async function deleteTableRecords(
  tableName: string, 
  primaryKeyName: string, 
  primaryKeyValues: any[]
) {
  await ensureSuperAdmin()
  try {
    const validTable = await validateTableName(tableName)

    // Fetch and validate columns
    const columnsResult: any = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = ${validTable} 
        AND column_name = ${primaryKeyName}
      LIMIT 1;
    `)

    if (columnsResult.length === 0) {
      return { success: false, error: `Invalid primary key name: ${primaryKeyName}` }
    }

    if (primaryKeyValues.length === 0) {
      return { success: false, error: 'No primary key values provided for deletion.' }
    }

    const placeholders = primaryKeyValues.map((_, i) => `$${i + 1}`).join(', ')
    const queryText = `DELETE FROM public."${validTable}" WHERE "${primaryKeyName}" IN (${placeholders})`

    await client.unsafe(queryText, primaryKeyValues)
    return { success: true }
  } catch (error: any) {
    console.error(`Failed to delete records from table ${tableName}:`, error)
    return { success: false, error: error.message || 'Failed to delete records.' }
  }
}
