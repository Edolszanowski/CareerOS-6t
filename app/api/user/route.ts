import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, last_name } = body

    // Validate required fields
    if (!email || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({
        success: true,
        id: existingUser[0].id,
        message: 'User already exists'
      })
    }

    // Create new user with the correct column names
    const result = await sql`
      INSERT INTO users (email, first_name, last_name, created_at)
      VALUES (${email}, ${first_name}, ${last_name}, NOW())
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      id: result[0].id,
      user: result[0]
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    let query
    if (email) {
      query = sql`SELECT * FROM users WHERE email = ${email}`
    } else if (id) {
      query = sql`SELECT * FROM users WHERE id = ${id}`
    } else {
      query = sql`SELECT * FROM users ORDER BY created_at DESC LIMIT 50`
    }

    const result = await query

    return NextResponse.json({
      success: true,
      users: result
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
