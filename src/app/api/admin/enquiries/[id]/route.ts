import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

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

    const enquiry = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    // Mark as read if not already
    if (!enquiry.isRead) {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      })
    }

    return NextResponse.json({ enquiry })
  } catch (error) {
    console.error('Error fetching enquiry:', error)
    return NextResponse.json({ error: 'Failed to fetch enquiry' }, { status: 500 })
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
    const { isRead, response, sendEmail } = await req.json()

    const enquiry = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    const updateData: any = {}

    if (typeof isRead === 'boolean') {
      updateData.isRead = isRead
    }

    if (response !== undefined) {
      updateData.response = response
      updateData.repliedAt = new Date()
    }

    const updatedEnquiry = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    })

    // Send email response if requested
    if (sendEmail && response) {
      try {
        await transporter.sendMail({
          from: `"Musical Masters" <${process.env.SMTP_USER}>`,
          to: enquiry.email,
          subject: `Re: ${enquiry.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #ff6b6b; margin: 0; font-size: 28px;">Musical Masters</h1>
              </div>

              <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1a1a2e; margin-top: 0;">Hello ${enquiry.name},</h2>

                <p>Thank you for your enquiry. Here is our response:</p>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
                  ${response.replace(/\n/g, '<br>')}
                </div>

                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

                <p style="color: #666; font-size: 14px;"><strong>Your original message:</strong></p>
                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; color: #666; font-size: 14px;">
                  <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${enquiry.subject}</p>
                  <p style="margin: 0;">${enquiry.message.replace(/\n/g, '<br>')}</p>
                </div>

                <p style="margin-top: 30px;">
                  If you have any further questions, please don't hesitate to reach out.<br><br>
                  Best regards,<br>
                  <strong>The Musical Masters Team</strong>
                </p>
              </div>

              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>Musical Masters | Jem Park, Sabaki, Kenya</p>
                <p>+254 784 177 547 | info@musicalmasters.com</p>
              </div>
            </body>
            </html>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send response email:', emailError)
        return NextResponse.json({
          enquiry: updatedEnquiry,
          warning: 'Response saved but email failed to send',
        })
      }
    }

    return NextResponse.json({ enquiry: updatedEnquiry })
  } catch (error) {
    console.error('Error updating enquiry:', error)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
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

    await prisma.contactMessage.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Enquiry deleted successfully' })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 })
  }
}
