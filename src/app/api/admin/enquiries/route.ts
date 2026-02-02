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

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status === 'unread') {
      where.isRead = false
    } else if (status === 'read') {
      where.isRead = true
    } else if (status === 'replied') {
      where.response = { not: null }
    } else if (status === 'pending') {
      where.response = null
    }

    const [enquiries, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ])

    // Get stats
    const [totalCount, unreadCount, repliedCount] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { response: { not: null } } }),
    ])

    return NextResponse.json({
      enquiries,
      stats: {
        total: totalCount,
        unread: unreadCount,
        replied: repliedCount,
        pending: totalCount - repliedCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}
