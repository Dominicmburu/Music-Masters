import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendRecordingShared } from '@/lib/email'

export const dynamic = 'force-dynamic'

interface ShareRecordingInput {
  studentIds: string[]
  message?: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body: ShareRecordingInput = await req.json()
    const { studentIds, message } = body

    if (!studentIds || studentIds.length === 0) {
      return NextResponse.json({ error: 'No students selected' }, { status: 400 })
    }

    const recording = await prisma.classRecording.findUnique({
      where: { id },
    })

    if (!recording) {
      return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
    }

    // Get students
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
    })

    // Create shared recordings
    const sharedRecordings = await Promise.all(
      studentIds.map(async (studentId: string) => {
        // Check if already shared
        const existing = await prisma.sharedRecording.findUnique({
          where: { recordingId_userId: { recordingId: id, userId: studentId } },
        })
        if (existing) return existing

        return prisma.sharedRecording.create({
          data: {
            recordingId: id,
            userId: studentId,
            message: message || null,
          },
        })
      })
    )

    // Create notifications and send emails
    for (const student of students) {
      // Create notification
      await prisma.notification.create({
        data: {
          userId: student.id,
          type: 'CLASS_RECORDING_SHARED',
          title: 'New Recording Shared! 📹',
          message: `A new class recording "${recording.title}" has been shared with you.`,
          metadata: { recordingId: id },
        },
      })

      // Send email (non-blocking)
      sendRecordingShared({
        studentEmail: student.email,
        studentName: student.firstName,
        recordingTitle: recording.title,
        description: recording.description || undefined,
        message: message || undefined,
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, shared: sharedRecordings.length })
  } catch (error) {
    console.error('Error sharing recording:', error)
    return NextResponse.json({ error: 'Failed to share recording' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')

    const recording = await prisma.classRecording.findUnique({
      where: { id },
    })

    if (!recording) {
      return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
    }

    if (studentId) {
      // Unshare from specific student
      await prisma.sharedRecording.delete({
        where: {
          recordingId_userId: {
            recordingId: id,
            userId: studentId,
          },
        },
      })
      return NextResponse.json({ message: 'Recording unshared from student' })
    } else {
      // Unshare from all students
      const result = await prisma.sharedRecording.deleteMany({
        where: { recordingId: id },
      })
      return NextResponse.json({ message: `Recording unshared from ${result.count} student(s)` })
    }
  } catch (error) {
    console.error('Error unsharing recording:', error)
    return NextResponse.json({ error: 'Failed to unshare recording' }, { status: 500 })
  }
}
