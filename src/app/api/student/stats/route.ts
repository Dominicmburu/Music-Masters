import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface BookingWithLesson {
  lesson: {
    duration: number
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalLessons, upcomingLessons, completedLessons] = await Promise.all([
      prisma.booking.count({
        where: { userId: session.userId },
      }),
      prisma.booking.count({
        where: {
          userId: session.userId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          scheduledDate: { gte: new Date() },
        },
      }),
      prisma.booking.count({
        where: {
          userId: session.userId,
          status: 'COMPLETED',
        },
      }),
    ])

    // Calculate hours learned
    const completedBookings: BookingWithLesson[] = await prisma.booking.findMany({
      where: {
        userId: session.userId,
        status: 'COMPLETED',
      },
      include: { lesson: true },
    })

    const hoursLearned = completedBookings.reduce((total: number, booking: BookingWithLesson) => {
      return total + (booking.lesson.duration / 60)
    }, 0)

    return NextResponse.json({
      totalLessons,
      upcomingLessons,
      completedLessons,
      hoursLearned: Math.round(hoursLearned * 10) / 10,
    })
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
