import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      },
    })

    // Send auto-reply email
    try {
      await transporter.sendMail({
        from: `"Musical Masters" <${process.env.SMTP_USER}>`,
        to: email.trim(),
        subject: `Thank you for contacting Musical Masters - ${subject}`,
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
              <h2 style="color: #1a1a2e; margin-top: 0;">Thank You for Reaching Out, ${name}!</h2>

              <p>We have received your message and appreciate you taking the time to contact us.</p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0;"><strong>Your Message:</strong></p>
                <p style="margin: 10px 0 0 0; color: #666;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>Our team will review your inquiry and get back to you within 24-48 hours. If your matter is urgent, please don't hesitate to call us directly at <strong>+254 784 177 547</strong>.</p>

              <p style="margin-top: 30px;">
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
      console.error('Failed to send auto-reply email:', emailError)
      // Don't fail the request if email fails - the message is saved
    }

    // Send notification to admin
    try {
      if (process.env.ADMIN_EMAIL) {
        await transporter.sendMail({
          from: `"Musical Masters Website" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
              <h2 style="color: #ff6b6b;">New Contact Form Submission</h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
              </table>

              <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <strong>Message:</strong>
                <p style="margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enquiries" style="display: inline-block; padding: 12px 24px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 6px;">View in Admin Panel</a>
              </p>
            </body>
            </html>
          `,
        })
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError)
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      id: contactMessage.id,
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
