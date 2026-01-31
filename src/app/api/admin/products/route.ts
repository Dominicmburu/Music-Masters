import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ProductCategory } from '@prisma/client'

export const dynamic = 'force-dynamic'

interface CreateProductInput {
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  stock?: number
  isActive?: boolean
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where: any = {}

    if (!includeInactive) {
      where.isActive = true
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { cartItems: true } },
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateProductInput = await req.json()
    const { name, description, price, category, image, stock = 0, isActive = true } = body

    if (!name || !description || price === undefined || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate category
    const validCategories = ['KEYBOARDS', 'GUITARS', 'DRUMS', 'STRING', 'BRASS', 'WOODWIND']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Validate image size (base64 ~2MB limit)
    if (image.length > 2.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large. Maximum size is 2MB' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        image,
        stock,
        isActive,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
