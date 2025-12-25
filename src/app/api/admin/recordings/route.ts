import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recordings = await prisma.classRecording.findMany({
      include: {
        instrument: true,
        sharedWith: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
      orderBy: { recordedAt: 'desc' },
    })

    return NextResponse.json({ recordings })
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return NextResponse.json({ error: 'Failed to fetch recordings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, youtubeUrl, thumbnailUrl, instrumentId, duration } = body

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: 'Title and YouTube URL are required' }, { status: 400 })
    }

    const recording = await prisma.classRecording.create({
      data: {
        title,
        description,
        youtubeUrl,
        thumbnailUrl,
        instrumentId: instrumentId || null,
        duration,
      },
      include: {
        instrument: true,
        sharedWith: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    })

    return NextResponse.json({ success: true, recording })
  } catch (error) {
    console.error('Error creating recording:', error)
    return NextResponse.json({ error: 'Failed to create recording' }, { status: 500 })
  }
}
