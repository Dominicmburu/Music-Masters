import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const student = await prisma.user.findUnique({
      where: { id, role: 'STUDENT' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        bookings: {
          orderBy: { scheduledDate: 'desc' },
          take: 10,
          include: {
            lesson: true,
            instrument: true,
          },
        },
        _count: { select: { bookings: true } },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { firstName, lastName, email, phone, isActive, password } = body

    const student = await prisma.user.findUnique({
      where: { id, role: 'STUDENT' },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check if email is being changed and already exists
    if (email && email.toLowerCase() !== student.email) {
      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
    }

    const updateData: any = {}

    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (email !== undefined) updateData.email = email.toLowerCase()
    if (phone !== undefined) updateData.phone = phone || null
    if (typeof isActive === 'boolean') updateData.isActive = isActive
    if (password) updateData.password = await hashPassword(password)

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
      },
    })

    return NextResponse.json({ student: updatedStudent })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const student = await prisma.user.findUnique({
      where: { id, role: 'STUDENT' },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Deactivate instead of hard delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Student deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating student:', error)
    return NextResponse.json({ error: 'Failed to deactivate student' }, { status: 500 })
  }
}
