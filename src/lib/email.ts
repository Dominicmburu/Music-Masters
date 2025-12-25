import nodemailer from 'nodemailer'
import { format } from 'date-fns'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Musical Masters <noreply@musicalmasters.com>',
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export function getEmailTemplate(type: string, data: Record<string, any>): string {
  const baseStyles = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      .header { background: linear-gradient(135deg, #1a1a1e 0%, #27272c 100%); padding: 30px; text-align: center; }
      .header h1 { color: #ef4444; margin: 0; font-size: 28px; font-weight: bold; }
      .header p { color: #ffffff; margin: 10px 0 0; font-size: 14px; }
      .content { padding: 30px; }
      .highlight-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
      .button { display: inline-block; background: #ef4444; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      .details-table td { padding: 12px 0; border-bottom: 1px solid #eee; }
      .details-table td:first-child { font-weight: 600; color: #333; width: 40%; }
    </style>
  `

  switch (type) {
    case 'booking_confirmation':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Musical Masters</h1>
              <p>Your Musical Journey Awaits</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1e; margin-top: 0;">Booking Confirmed! 🎉</h2>
              <p>Dear ${data.studentName},</p>
              <p>Your lesson has been successfully booked. We're excited to see you!</p>
              
              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #ef4444;">Booking Details</h3>
                <table class="details-table">
                  <tr><td>Lesson</td><td>${data.lessonTitle}</td></tr>
                  <tr><td>Instrument</td><td>${data.instrument}</td></tr>
                  <tr><td>Date</td><td>${data.date}</td></tr>
                  <tr><td>Time</td><td>${data.time}</td></tr>
                  <tr><td>Duration</td><td>${data.duration} minutes</td></tr>
                </table>
              </div>
              
              <p><strong>Location:</strong> Musical Masters Studio, Westlands, Nairobi</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Your Dashboard</a>
              
              <p style="color: #666; font-size: 14px;">
                Need to reschedule? You can manage your booking from your dashboard up to 24 hours before the lesson.
              </p>
            </div>
            <div class="footer">
              <p>Musical Masters | Westlands, Nairobi, Kenya</p>
              <p>+254 712 345 678 | info@musicalmasters.com</p>
            </div>
          </div>
        </body>
        </html>
      `

    case 'booking_reminder':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Musical Masters</h1>
              <p>Lesson Reminder</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1e; margin-top: 0;">Your Lesson Starts Soon! ⏰</h2>
              <p>Dear ${data.studentName},</p>
              <p>This is a friendly reminder that your lesson is starting in <strong>1 hour</strong>.</p>
              
              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #ef4444;">Lesson Details</h3>
                <table class="details-table">
                  <tr><td>Lesson</td><td>${data.lessonTitle}</td></tr>
                  <tr><td>Instrument</td><td>${data.instrument}</td></tr>
                  <tr><td>Time</td><td>${data.time}</td></tr>
                </table>
              </div>
              
              <p><strong>What to bring:</strong></p>
              <ul style="color: #666;">
                <li>Your instrument (if applicable)</li>
                <li>Any music sheets or materials</li>
                <li>A positive attitude! 🎶</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
            </div>
            <div class="footer">
              <p>Musical Masters | Westlands, Nairobi, Kenya</p>
              <p>+254 712 345 678 | info@musicalmasters.com</p>
            </div>
          </div>
        </body>
        </html>
      `

    case 'recording_shared':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Musical Masters</h1>
              <p>New Class Recording Available</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1e; margin-top: 0;">New Recording Shared! 📹</h2>
              <p>Dear ${data.studentName},</p>
              <p>Great news! A new class recording has been shared with you.</p>
              
              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #ef4444;">${data.recordingTitle}</h3>
                <p style="margin-bottom: 0;">${data.description || 'Watch and practice at your own pace.'}</p>
              </div>
              
              ${data.message ? `<p><strong>Message from your instructor:</strong> "${data.message}"</p>` : ''}
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/recordings" class="button">Watch Now</a>
              
              <p style="color: #666; font-size: 14px;">
                This recording is available in your dashboard's recordings section.
              </p>
            </div>
            <div class="footer">
              <p>Musical Masters | Westlands, Nairobi, Kenya</p>
              <p>+254 712 345 678 | info@musicalmasters.com</p>
            </div>
          </div>
        </body>
        </html>
      `

    case 'booking_cancelled':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Musical Masters</h1>
              <p>Booking Update</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1e; margin-top: 0;">Booking Cancelled</h2>
              <p>Dear ${data.studentName},</p>
              <p>Your booking for the following lesson has been cancelled:</p>
              
              <div class="highlight-box">
                <table class="details-table">
                  <tr><td>Lesson</td><td>${data.lessonTitle}</td></tr>
                  <tr><td>Date</td><td>${data.date}</td></tr>
                  <tr><td>Time</td><td>${data.time}</td></tr>
                </table>
              </div>
              
              ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
              
              <p>Would you like to book another lesson?</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/book" class="button">Book a New Lesson</a>
            </div>
            <div class="footer">
              <p>Musical Masters | Westlands, Nairobi, Kenya</p>
              <p>+254 712 345 678 | info@musicalmasters.com</p>
            </div>
          </div>
        </body>
        </html>
      `

    case 'welcome':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Musical Masters</h1>
              <p>Welcome to the Family!</p>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1e; margin-top: 0;">Welcome, ${data.firstName}! 🎉</h2>
              <p>We're thrilled to have you join Musical Masters!</p>
              <p>Your account has been created successfully. You can now:</p>
              
              <ul style="color: #333; line-height: 2;">
                <li>📅 Book lessons with our expert instructors</li>
                <li>🎵 Access your personalized dashboard</li>
                <li>📹 Watch shared class recordings</li>
                <li>📊 Track your musical progress</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to Your Account</a>
              
              <p style="color: #666; font-size: 14px;">
                Have questions? Contact us anytime at info@musicalmasters.com or via WhatsApp.
              </p>
            </div>
            <div class="footer">
              <p>Musical Masters | Westlands, Nairobi, Kenya</p>
              <p>+254 712 345 678 | info@musicalmasters.com</p>
            </div>
          </div>
        </body>
        </html>
      `

    default:
      return ''
  }
}

export async function sendBookingConfirmation(booking: {
  studentEmail: string
  studentName: string
  lessonTitle: string
  instrument: string
  date: Date
  startTime: string
  endTime: string
  duration: number
}) {
  const html = getEmailTemplate('booking_confirmation', {
    studentName: booking.studentName,
    lessonTitle: booking.lessonTitle,
    instrument: booking.instrument,
    date: format(booking.date, 'EEEE, MMMM d, yyyy'),
    time: `${booking.startTime} - ${booking.endTime}`,
    duration: booking.duration,
  })

  return sendEmail({
    to: booking.studentEmail,
    subject: '✅ Booking Confirmed - Musical Masters',
    html,
  })
}

export async function sendBookingReminder(booking: {
  studentEmail: string
  studentName: string
  lessonTitle: string
  instrument: string
  startTime: string
}) {
  const html = getEmailTemplate('booking_reminder', {
    studentName: booking.studentName,
    lessonTitle: booking.lessonTitle,
    instrument: booking.instrument,
    time: booking.startTime,
  })

  return sendEmail({
    to: booking.studentEmail,
    subject: '⏰ Lesson Reminder - Starting in 1 Hour!',
    html,
  })
}

export async function sendRecordingShared(data: {
  studentEmail: string
  studentName: string
  recordingTitle: string
  description?: string
  message?: string
}) {
  const html = getEmailTemplate('recording_shared', data)

  return sendEmail({
    to: data.studentEmail,
    subject: '📹 New Class Recording Available - Musical Masters',
    html,
  })
}

export async function sendWelcomeEmail(user: {
  email: string
  firstName: string
}) {
  const html = getEmailTemplate('welcome', user)

  return sendEmail({
    to: user.email,
    subject: '🎵 Welcome to Musical Masters!',
    html,
  })
}

export async function sendBookingCancellation(data: {
  studentEmail: string
  studentName: string
  lessonTitle: string
  date: string
  time: string
  reason?: string
}) {
  const html = getEmailTemplate('booking_cancelled', data)

  return sendEmail({
    to: data.studentEmail,
    subject: 'Booking Cancelled - Musical Masters',
    html,
  })
}
