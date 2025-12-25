import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendBookingConfirmation } from '@/lib/email'
import { format, parseISO } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    // Students can only see their own bookings
    if (session.role === 'STUDENT') {
      where.userId = session.userId
    }
    
    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        lesson: true,
        instrument: true,
        payment: true,
      },
      orderBy: { scheduledDate: 'asc' },
      take: limit,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, instrumentId, scheduledDate, startTime, endTime, timeSlotId, notes } = body

    // Validate required fields
    if (!lessonId || !instrumentId || !scheduledDate || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the lesson details
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { instrument: true },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Check for existing booking at the same time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduledDate: new Date(scheduledDate),
        startTime,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          { userId: session.userId },
          { timeSlotId },
        ],
      },
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 400 })
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.userId,
        lessonId,
        instrumentId,
        scheduledDate: new Date(scheduledDate),
        startTime,
        endTime,
        timeSlotId,
        notes,
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        lesson: true,
        instrument: true,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: session.userId,
        bookingId: booking.id,
        amount: lesson.price,
        status: 'PENDING',
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.userId,
        type: 'BOOKING_CONFIRMATION',
        title: 'Booking Confirmed! 🎵',
        message: `Your ${lesson.title} lesson has been scheduled for ${format(new Date(scheduledDate), 'MMMM d, yyyy')} at ${startTime}.`,
        metadata: { bookingId: booking.id },
      },
    })

    // Send confirmation email (non-blocking)
    sendBookingConfirmation({
      studentEmail: booking.user.email,
      studentName: booking.user.firstName,
      lessonTitle: booking.lesson.title,
      instrument: booking.instrument.name,
      date: new Date(scheduledDate),
      startTime,
      endTime,
      duration: booking.lesson.duration,
    }).catch(console.error)

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
