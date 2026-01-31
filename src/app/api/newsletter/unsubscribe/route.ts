import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'newsletter-unsubscribe-secret'

// Generate unsubscribe token
export function generateUnsubscribeToken(email: string): string {
  const data = `${email}:${UNSUBSCRIBE_SECRET}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Verify unsubscribe token
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expectedToken = generateUnsubscribeToken(email)
  return token === expectedToken
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 400 })
    }

    const decodedEmail = decodeURIComponent(email)

    // Verify token
    if (!verifyUnsubscribeToken(decodedEmail, token)) {
      return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 400 })
    }

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: decodedEmail.toLowerCase() },
    })

    if (!subscriber) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    if (!subscriber.isActive) {
      return NextResponse.json({ message: 'Already unsubscribed' })
    }

    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { email: decodedEmail.toLowerCase() },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Unsubscribed successfully' })
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
