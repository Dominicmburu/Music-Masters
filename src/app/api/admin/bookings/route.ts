import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { parseISO } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}

    if (startDate && endDate) {
      where.scheduledDate = {
        gte: parseISO(startDate),
        lte: parseISO(endDate),
      }
    }

    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        lesson: true,
        instrument: true,
        payment: true,
      },
      orderBy: [{ scheduledDate: 'asc' }, { startTime: 'asc' }],
      take: limit,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
