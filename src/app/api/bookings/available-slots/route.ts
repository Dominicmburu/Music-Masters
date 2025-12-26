import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseISO, getDay } from 'date-fns'

export const dynamic = 'force-dynamic'

interface TimeSlotRecord {
  id: string
  startTime: string
  endTime: string
}

interface BookingRecord {
  startTime: string
  timeSlotId: string | null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')
    const dateStr = searchParams.get('date')

    if (!lessonId || !dateStr) {
      return NextResponse.json({ error: 'Missing lessonId or date' }, { status: 400 })
    }

    const date = parseISO(dateStr)
    const dayOfWeek = getDay(date)

    // Get all time slots for the lesson on this day of week
    const timeSlots: TimeSlotRecord[] = await prisma.timeSlot.findMany({
      where: {
        lessonId,
        dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    })

    // Get existing bookings for this date
    const existingBookings: BookingRecord[] = await prisma.booking.findMany({
      where: {
        scheduledDate: date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { startTime: true, timeSlotId: true },
    })

    const bookedSlotIds = new Set(existingBookings.map((b: BookingRecord) => b.timeSlotId))
    const bookedTimes = new Set(existingBookings.map((b: BookingRecord) => b.startTime))

    // Mark slots as available or not
    const slots = timeSlots.map((slot: TimeSlotRecord) => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: !bookedSlotIds.has(slot.id) && !bookedTimes.has(slot.startTime),
    }))

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 })
  }
}
