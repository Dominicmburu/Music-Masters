import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email: normalizedEmail },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        })
        return NextResponse.json({ message: 'Subscription reactivated successfully' })
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    })

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
