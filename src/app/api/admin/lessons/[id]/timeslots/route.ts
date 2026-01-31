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

    const timeSlots = await prisma.timeSlot.findMany({
      where: { lessonId: id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json({ timeSlots })
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Failed to fetch time slots' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { dayOfWeek, startTime, endTime } = await req.json()

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for overlapping slots
    const existing = await prisma.timeSlot.findFirst({
      where: {
        lessonId: id,
        dayOfWeek: parseInt(dayOfWeek),
        isActive: true,
        OR: [
          { AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] },
          { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
          { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] },
        ],
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Time slot overlaps with existing slot' }, { status: 400 })
    }

    const timeSlot = await prisma.timeSlot.create({
      data: {
        lessonId: id,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
      },
    })

    return NextResponse.json({ timeSlot })
  } catch (error) {
    console.error('Error creating time slot:', error)
    return NextResponse.json({ error: 'Failed to create time slot' }, { status: 500 })
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
    const { searchParams } = new URL(req.url)
    const slotId = searchParams.get('slotId')

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID required' }, { status: 400 })
    }

    // Check for future bookings using this slot
    const futureBookings = await prisma.booking.count({
      where: {
        timeSlotId: slotId,
        scheduledDate: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (futureBookings > 0) {
      // Deactivate instead
      await prisma.timeSlot.update({
        where: { id: slotId },
        data: { isActive: false },
      })
      return NextResponse.json({ message: 'Time slot deactivated (has future bookings)' })
    }

    await prisma.timeSlot.delete({ where: { id: slotId } })
    return NextResponse.json({ message: 'Time slot deleted' })
  } catch (error) {
    console.error('Error deleting time slot:', error)
    return NextResponse.json({ error: 'Failed to delete time slot' }, { status: 500 })
  }
}
