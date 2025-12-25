import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const instruments = await prisma.instrument.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ instruments })
  } catch (error) {
    console.error('Error fetching instruments:', error)
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 })
  }
}
