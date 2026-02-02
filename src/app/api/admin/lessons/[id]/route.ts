import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        instrument: true,
        timeSlots: {
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        _count: {
          select: { bookings: true },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
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
    const { title, description, instrumentId, lessonType, duration, price, maxStudents, isActive } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (instrumentId !== undefined) updateData.instrumentId = instrumentId
    if (lessonType !== undefined) updateData.lessonType = lessonType
    if (duration !== undefined) updateData.duration = parseInt(duration)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (maxStudents !== undefined) updateData.maxStudents = parseInt(maxStudents)
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        instrument: true,
        timeSlots: true,
      },
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
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

    // Check for existing bookings
    const bookingCount = await prisma.booking.count({
      where: { lessonId: id },
    })

    if (bookingCount > 0) {
      // Deactivate instead of delete
      await prisma.lesson.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json({ message: 'Lesson deactivated (has bookings)' })
    }

    // Delete time slots first, then lesson
    await prisma.timeSlot.deleteMany({ where: { lessonId: id } })
    await prisma.lesson.delete({ where: { id } })

    return NextResponse.json({ message: 'Lesson deleted' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
