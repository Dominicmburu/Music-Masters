import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfMonth, startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const monthStart = startOfMonth(now)
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)

    // Run all queries with error handling
    let totalStudents = 0
    let totalBookings = 0
    let completedBookings: any[] = []
    let newStudentsThisMonth = 0
    let bookingsToday = 0
    let upcomingLessons = 0

    try {
      totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } })
    } catch (e) { console.error('Error counting students:', e) }

    try {
      totalBookings = await prisma.booking.count()
    } catch (e) { console.error('Error counting bookings:', e) }

    try {
      completedBookings = await prisma.booking.findMany({
        where: { status: 'COMPLETED' },
        include: { lesson: true },
      })
    } catch (e) { console.error('Error fetching completed bookings:', e) }

    try {
      newStudentsThisMonth = await prisma.user.count({
        where: { role: 'STUDENT', createdAt: { gte: monthStart } },
      })
    } catch (e) { console.error('Error counting new students:', e) }

    try {
      bookingsToday = await prisma.booking.count({
        where: {
          scheduledDate: { gte: todayStart, lte: todayEnd },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      })
    } catch (e) { console.error('Error counting today bookings:', e) }

    try {
      upcomingLessons = await prisma.booking.count({
        where: {
          scheduledDate: { gte: now },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      })
    } catch (e) { console.error('Error counting upcoming lessons:', e) }

    // Calculate revenue
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.lesson?.price || 0), 0)
    
    let revenueThisMonth = 0
    try {
      const monthlyCompletedBookings = await prisma.booking.findMany({
        where: { status: 'COMPLETED', scheduledDate: { gte: monthStart } },
        include: { lesson: true },
      })
      revenueThisMonth = monthlyCompletedBookings.reduce((sum, b) => sum + (b.lesson?.price || 0), 0)
    } catch (e) { console.error('Error calculating monthly revenue:', e) }

    return NextResponse.json({
      totalStudents,
      totalBookings,
      totalRevenue,
      upcomingLessons,
      completedLessons: completedBookings.length,
      newStudentsThisMonth,
      revenueThisMonth,
      bookingsToday,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ 
      totalStudents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      upcomingLessons: 0,
      completedLessons: 0,
      newStudentsThisMonth: 0,
      revenueThisMonth: 0,
      bookingsToday: 0,
    })
  }
}
