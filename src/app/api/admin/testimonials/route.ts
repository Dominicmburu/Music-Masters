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

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentName, content, rating, avatar } = await req.json()

    if (!studentName || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        studentName,
        content,
        rating: rating ? parseInt(rating) : 5,
        avatar: avatar || null,
      },
    })

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
