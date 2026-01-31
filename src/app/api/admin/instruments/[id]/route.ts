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

    const instrument = await prisma.instrument.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { title: 'asc' },
        },
        _count: {
          select: {
            lessons: true,
            bookings: true,
            recordings: true,
          },
        },
      },
    })

    if (!instrument) {
      return NextResponse.json({ error: 'Instrument not found' }, { status: 404 })
    }

    return NextResponse.json({ instrument })
  } catch (error) {
    console.error('Error fetching instrument:', error)
    return NextResponse.json({ error: 'Failed to fetch instrument' }, { status: 500 })
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
    const { name, description, icon, isActive } = await req.json()

    const instrument = await prisma.instrument.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    })

    return NextResponse.json({ instrument })
  } catch (error) {
    console.error('Error updating instrument:', error)
    return NextResponse.json({ error: 'Failed to update instrument' }, { status: 500 })
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

    // Check if instrument has related data
    const instrument = await prisma.instrument.findUnique({
      where: { id },
      include: {
        _count: {
          select: { lessons: true, bookings: true },
        },
      },
    })

    if (!instrument) {
      return NextResponse.json({ error: 'Instrument not found' }, { status: 404 })
    }

    // If has related data, just deactivate
    if (instrument._count.lessons > 0 || instrument._count.bookings > 0) {
      await prisma.instrument.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json({ message: 'Instrument deactivated (has related data)' })
    }

    // Otherwise, delete
    await prisma.instrument.delete({ where: { id } })
    return NextResponse.json({ message: 'Instrument deleted' })
  } catch (error) {
    console.error('Error deleting instrument:', error)
    return NextResponse.json({ error: 'Failed to delete instrument' }, { status: 500 })
  }
}
