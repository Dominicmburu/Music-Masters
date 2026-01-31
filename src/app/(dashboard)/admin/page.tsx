'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Calendar, DollarSign, TrendingUp, Clock, BookOpen, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime, formatCurrency, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface DashboardStats {
  totalStudents: number
  totalBookings: number
  totalRevenue: number
  upcomingLessons: number
  completedLessons: number
  newStudentsThisMonth: number
  revenueThisMonth: number
  bookingsToday: number
}

interface RecentBooking {
  id: string
  scheduledDate: string
  startTime: string
  status: string
  user: { firstName: string; lastName: string; email: string }
  lesson: { title: string }
  instrument: { name: string; icon: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/bookings?limit=5'),
      ])
      const [statsData, bookingsData] = await Promise.all([statsRes.json(), bookingsRes.json()])
      if (statsData) setStats(statsData)
      if (bookingsData.bookings) setRecentBookings(bookingsData.bookings)
    } catch (error) { console.error('Error fetching dashboard data:', error) }
    finally { setLoading(false) }
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-blue-500', change: '+12%', positive: true },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'bg-coral-500', change: '+8%', positive: true },
    { label: 'Revenue (KES)', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500', change: '+15%', positive: true },
    { label: 'Today\'s Lessons', value: stats?.bookingsToday || 0, icon: Clock, color: 'bg-purple-500', change: '3 pending', positive: true },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'destructive'> = {
      CONFIRMED: 'success', PENDING: 'warning', COMPLETED: 'info', CANCELLED: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Admin Dashboard</h1>
          <p className="text-charcoal-500 mt-1">Welcome back! Here's your studio overview</p>
        </div>
        <div className="flex gap-3">
          {/* <Link href="/admin/bookings/new"><Button variant="outline">Add Booking</Button></Link> */}
          <Link href="/admin/students/new"><Button>Add Student</Button></Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-charcoal-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-charcoal-900 mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link href="/admin/bookings"><Button variant="ghost" size="sm" className="gap-1">View All <ChevronRight className="w-4 h-4" /></Button></Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-charcoal-100 rounded-xl animate-pulse" />)}</div>
              ) : recentBookings.length === 0 ? (
                <p className="text-center text-charcoal-500 py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 bg-charcoal-50 rounded-xl hover:bg-charcoal-100 transition-colors">
                      <Avatar>
                        <AvatarFallback className="bg-coral-100 text-coral-600">{getInitials(booking.user.firstName, booking.user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal-900">{booking.user.firstName} {booking.user.lastName}</h4>
                        <p className="text-sm text-charcoal-500">{booking.lesson.title} • {booking.instrument.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDate(booking.scheduledDate, 'MMM d')}</p>
                        <p className="text-xs text-charcoal-500">{formatTime(booking.startTime)}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {/* <Link href="/admin/bookings/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-3"><Calendar className="w-5 h-5 text-coral-500" />Create Booking</Button>
              </Link> */}
              <Link href="/admin/students/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-3"><Users className="w-5 h-5 text-blue-500" />Add New Student</Button>
              </Link>
              <Link href="/admin/recordings/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-3"><BookOpen className="w-5 h-5 text-green-500" />Upload Recording</Button>
              </Link>
              <Link href="/admin/calendar" className="block">
                <Button variant="outline" className="w-full justify-start gap-3"><Clock className="w-5 h-5 text-purple-500" />View Calendar</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Today's Schedule Preview */}
          <Card className="mt-6">
            <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-charcoal-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No lessons scheduled for today</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
