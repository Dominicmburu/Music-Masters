import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface SharedRecordingWithDetails {
  sharedAt: Date
  viewedAt: Date | null
  message: string | null
  recording: {
    id: string
    title: string
    description: string | null
    youtubeUrl: string
    thumbnailUrl: string | null
    duration: string | null
    recordedAt: Date
    instrument: {
      id: string
      name: string
      icon: string | null
    } | null
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const sharedRecordings: SharedRecordingWithDetails[] = await prisma.sharedRecording.findMany({
      where: { userId: session.userId },
      include: {
        recording: {
          include: { instrument: true },
        },
      },
      orderBy: { sharedAt: 'desc' },
      take: limit,
    })

    const recordings = sharedRecordings.map((sr: SharedRecordingWithDetails) => ({
      id: sr.recording.id,
      title: sr.recording.title,
      description: sr.recording.description,
      youtubeUrl: sr.recording.youtubeUrl,
      thumbnailUrl: sr.recording.thumbnailUrl,
      duration: sr.recording.duration,
      recordedAt: sr.recording.recordedAt,
      instrument: sr.recording.instrument,
      sharedAt: sr.sharedAt,
      viewedAt: sr.viewedAt,
      message: sr.message,
    }))

    return NextResponse.json({ recordings })
  } catch (error) {
    console.error('Error fetching shared recordings:', error)
    return NextResponse.json({ error: 'Failed to fetch recordings' }, { status: 500 })
  }
}
