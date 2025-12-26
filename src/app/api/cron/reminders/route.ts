import { NextRequest, NextResponse } from 'next/server'
import { sendLessonReminders, markCompletedLessons } from '@/lib/cron'

export const dynamic = 'force-dynamic'

// This endpoint can be called by a cron service (like Vercel Cron, Railway Cron, etc.)
// Add authentication via a secret key in production
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Verify cron secret in production
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Run both tasks
    const [remindersResult, completionResult] = await Promise.all([
      sendLessonReminders(),
      markCompletedLessons(),
    ])

    return NextResponse.json({
      success: true,
      reminders: remindersResult,
      completions: completionResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
