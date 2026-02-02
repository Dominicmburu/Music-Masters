import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { studentName, content, rating, avatar, isActive } = body

    const updateData: any = {}
    if (studentName !== undefined) updateData.studentName = studentName
    if (content !== undefined) updateData.content = content
    if (rating !== undefined) updateData.rating = parseInt(rating)
    if (avatar !== undefined) updateData.avatar = avatar
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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

    await prisma.testimonial.delete({ where: { id } })

    return NextResponse.json({ message: 'Testimonial deleted' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
