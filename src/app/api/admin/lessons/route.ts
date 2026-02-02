import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const instrumentId = searchParams.get('instrumentId')

    const where: any = {}
    if (instrumentId) where.instrumentId = instrumentId

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ instrument: { name: 'asc' } }, { title: 'asc' }],
      include: {
        instrument: true,
        timeSlots: {
          where: { isActive: true },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        _count: {
          select: { bookings: true },
        },
      },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, instrumentId, lessonType, duration, price, maxStudents } = await req.json()

    if (!title || !instrumentId || !lessonType || !duration || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        instrumentId,
        lessonType,
        duration: parseInt(duration),
        price: parseFloat(price),
        maxStudents: maxStudents ? parseInt(maxStudents) : 1,
      },
      include: {
        instrument: true,
        timeSlots: true,
      },
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}
