import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import nodemailer from 'nodemailer'
import { generateUnsubscribeToken } from '@/lib/newsletter'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, content, recipientIds, sendToAll } = await req.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    let subscribers: { id: string; email: string }[] = []

    if (sendToAll) {
      subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { id: true, email: true },
      })
    } else if (recipientIds && recipientIds.length > 0) {
      subscribers = await prisma.newsletterSubscriber.findMany({
        where: {
          id: { in: recipientIds },
          isActive: true,
        },
        select: { id: true, email: true },
      })
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers to send to' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    let successCount = 0
    let failCount = 0
    const errors: string[] = []

    // Send emails
    for (const subscriber of subscribers) {
      try {
        const unsubscribeToken = generateUnsubscribeToken(subscriber.email)
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${unsubscribeToken}`

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              ${content}
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; text-align: center;">
                You received this email because you subscribed to the Musical Masters newsletter.<br>
                <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a>
              </p>
            </div>
          </body>
          </html>
        `

        await transporter.sendMail({
          from: `"Musical Masters" <${process.env.SMTP_USER}>`,
          to: subscriber.email,
          subject: subject,
          html: htmlContent,
        })

        successCount++
      } catch (error: any) {
        failCount++
        errors.push(`${subscriber.email}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: `Newsletter sent to ${successCount} subscribers`,
      stats: {
        total: subscribers.length,
        success: successCount,
        failed: failCount,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
