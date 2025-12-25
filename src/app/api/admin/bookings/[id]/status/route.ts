import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const { status } = body

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        lesson: true,
        instrument: true,
      },
    })

    // Create notification for the student
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'GENERAL',
        title: `Booking ${status}`,
        message: `Your ${booking.lesson.title} booking has been marked as ${status.toLowerCase()}.`,
        metadata: { bookingId: id },
      },
    })

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
