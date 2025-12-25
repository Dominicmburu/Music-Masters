import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, email, phone, password } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const generatedPassword = password || Math.random().toString(36).slice(-8)
    const hashedPassword = await hashPassword(generatedPassword)

    const student = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role: 'STUDENT',
      },
    })

    // Send welcome email
    sendWelcomeEmail({ email: student.email, firstName: student.firstName }).catch(console.error)

    return NextResponse.json({ success: true, student, temporaryPassword: generatedPassword })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
