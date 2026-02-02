import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { quantity } = await req.json()

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 })
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: { userId: session.userId },
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    if (quantity === 0) {
      // Delete the item if quantity is 0
      await prisma.cartItem.delete({ where: { id } })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    })

    return NextResponse.json({ cartItem: updatedItem })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: { userId: session.userId },
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id } })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 })
  }
}
