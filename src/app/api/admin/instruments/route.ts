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

    const instruments = await prisma.instrument.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            lessons: true,
            bookings: true,
            recordings: true,
          },
        },
      },
    })

    return NextResponse.json({ instruments })
  } catch (error) {
    console.error('Error fetching instruments:', error)
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, icon } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const instrument = await prisma.instrument.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
      },
    })

    return NextResponse.json({ instrument })
  } catch (error) {
    console.error('Error creating instrument:', error)
    return NextResponse.json({ error: 'Failed to create instrument' }, { status: 500 })
  }
}
