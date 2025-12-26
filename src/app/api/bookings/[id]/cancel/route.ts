import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendBookingCancellation } from '@/lib/email'
import { format, differenceInHours } from 'date-fns'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: { id: string }
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, lesson: true, instrument: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check ownership (unless admin)
    if (session.role !== 'ADMIN' && booking.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check cancellation policy (24 hours notice)
    const hoursUntilLesson = differenceInHours(
      new Date(booking.scheduledDate),
      new Date()
    )

    if (hoursUntilLesson < 24 && session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cancellations must be made at least 24 hours before the lesson' },
        { status: 400 }
      )
    }

    // Update booking status
    await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        type: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled',
        message: `Your ${booking.lesson.title} lesson on ${format(booking.scheduledDate, 'MMMM d, yyyy')} has been cancelled.`,
        metadata: { bookingId: id },
      },
    })

    // Send cancellation email
    sendBookingCancellation({
      studentEmail: booking.user.email,
      studentName: booking.user.firstName,
      lessonTitle: booking.lesson.title,
      date: format(booking.scheduledDate, 'MMMM d, yyyy'),
      time: booking.startTime,
    }).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}
