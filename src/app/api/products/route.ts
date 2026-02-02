import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const ids = searchParams.get('ids')

    const where: any = { isActive: true }

    // If fetching by IDs (for cart), allow inactive products too
    if (ids) {
      const productIds = ids.split(',').filter(Boolean)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          stock: true,
          isActive: true,
        },
      })
      return NextResponse.json({ products })
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
