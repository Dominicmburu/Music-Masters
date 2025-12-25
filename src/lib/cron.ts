import prisma from '@/lib/prisma'
import { sendBookingReminder } from '@/lib/email'
import { addHours, startOfHour, endOfHour, format } from 'date-fns'

/**
 * This function should be called by a cron job every hour
 * to send reminders for lessons starting in 1 hour
 */
export async function sendLessonReminders() {
  try {
    console.log('[Reminder Service] Starting reminder check...')
    
    // Get settings
    const settings = await prisma.studioSettings.findFirst()
    const reminderHours = settings?.reminderHoursBefore || 1

    // Calculate the time window for lessons starting in reminderHours
    const targetTime = addHours(new Date(), reminderHours)
    const startWindow = startOfHour(targetTime)
    const endWindow = endOfHour(targetTime)

    // Find all confirmed bookings in this time window
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        scheduledDate: {
          gte: startWindow,
          lte: endWindow,
        },
      },
      include: {
        user: true,
        lesson: true,
        instrument: true,
      },
    })

    console.log(`[Reminder Service] Found ${upcomingBookings.length} bookings to remind`)

    // Send reminders
    for (const booking of upcomingBookings) {
      try {
        await sendBookingReminder({
          studentEmail: booking.user.email,
          studentName: booking.user.firstName,
          lessonTitle: booking.lesson.title,
          instrument: booking.instrument.name,
          startTime: format(booking.scheduledDate, 'h:mm a'),
        })

        // Create a notification
        await prisma.notification.create({
          data: {
            userId: booking.userId,
            type: 'BOOKING_REMINDER',
            title: 'Lesson Starting Soon! ⏰',
            message: `Your ${booking.lesson.title} lesson starts in ${reminderHours} hour(s).`,
            metadata: { bookingId: booking.id },
          },
        })

        console.log(`[Reminder Service] Sent reminder to ${booking.user.email}`)
      } catch (error) {
        console.error(`[Reminder Service] Failed to send reminder to ${booking.user.email}:`, error)
      }
    }

    console.log('[Reminder Service] Reminder check completed')
    return { success: true, remindersSet: upcomingBookings.length }
  } catch (error) {
    console.error('[Reminder Service] Error:', error)
    return { success: false, error }
  }
}

/**
 * Mark lessons as completed after they end
 */
export async function markCompletedLessons() {
  try {
    const now = new Date()

    const result = await prisma.booking.updateMany({
      where: {
        status: 'CONFIRMED',
        scheduledDate: { lt: now },
      },
      data: {
        status: 'COMPLETED',
      },
    })

    console.log(`[Completion Service] Marked ${result.count} lessons as completed`)
    return { success: true, completed: result.count }
  } catch (error) {
    console.error('[Completion Service] Error:', error)
    return { success: false, error }
  }
}
