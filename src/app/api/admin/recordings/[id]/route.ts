import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.classRecording.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting recording:', error)
    return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const recording = await prisma.classRecording.findUnique({
      where: { id },
      include: {
        instrument: true,
        sharedWith: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    })

    if (!recording) {
      return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
    }

    return NextResponse.json({ recording })
  } catch (error) {
    console.error('Error fetching recording:', error)
    return NextResponse.json({ error: 'Failed to fetch recording' }, { status: 500 })
  }
}
