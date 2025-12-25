import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await req.json()

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role: 'STUDENT',
      },
    })

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    await setAuthCookie(token)

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'GENERAL',
        title: 'Welcome to Musical Masters! 🎵',
        message: 'We\'re excited to have you join our community. Start by booking your first lesson!',
      },
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ email: user.email, firstName: user.firstName }).catch(console.error)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
