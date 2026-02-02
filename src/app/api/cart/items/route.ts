import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId },
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      })
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
        include: { product: true },
      })
    }

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
