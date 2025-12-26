import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { LessonType } from '@prisma/client'


export const dynamic = 'force-dynamic'

interface LessonFilter {
  isActive: boolean
  instrumentId?: string
  lessonType?: LessonType
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const instrumentId = searchParams.get('instrumentId')
    const lessonType = searchParams.get('type')

    const where: LessonFilter = { isActive: true }
    if (instrumentId) where.instrumentId = instrumentId
    if (lessonType) where.lessonType = lessonType as LessonType

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
