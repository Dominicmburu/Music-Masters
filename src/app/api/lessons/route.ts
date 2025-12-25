import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const instrumentId = searchParams.get('instrumentId')
    const lessonType = searchParams.get('type')

    const where: any = { isActive: true }
    if (instrumentId) where.instrumentId = instrumentId
    if (lessonType) where.lessonType = lessonType

    const lessons = await prisma.lesson.findMany({
      where,
      include: { instrument: true },
      orderBy: { title: 'asc' },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}
