import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Find the shared recording for this user
    const sharedRecording = await prisma.sharedRecording.findFirst({
      where: {
        id,
        userId: session.id,
      },
    })

    if (!sharedRecording) {
      return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
    }

    // Update viewedAt timestamp
    await prisma.sharedRecording.update({
      where: { id },
      data: { viewedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking recording as viewed:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
