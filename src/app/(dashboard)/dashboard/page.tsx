'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Music,
  Video,
  BookOpen,
  ArrowRight,
  Play,
  ChevronRight,
  Bell,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { formatDate, formatTime, formatCurrency, getInstrumentEmoji } from '@/lib/utils'

interface Booking {
  id: string
  scheduledDate: string
  startTime: string
  endTime: string
  status: string
  lesson: {
    title: string
    duration: number
  }
  instrument: {
    name: string
    icon: string
  }
}

interface Recording {
  id: string
  title: string
  description: string
  youtubeUrl: string
  thumbnailUrl: string
  duration: string
  recordedAt: string
  instrument: {
    name: string
  }
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function StudentDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [recentRecordings, setRecentRecordings] = useState<Recording[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState({
    totalLessons: 0,
    upcomingLessons: 0,
    completedLessons: 0,
    hoursLearned: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, recordingsRes, notificationsRes, statsRes] = await Promise.all([
        fetch('/api/bookings?status=CONFIRMED&limit=5'),
        fetch('/api/recordings/shared?limit=3'),
        fetch('/api/notifications?limit=5'),
        fetch('/api/student/stats'),
      ])

      const [bookingsData, recordingsData, notificationsData, statsData] = await Promise.all([
        bookingsRes.json(),
        recordingsRes.json(),
        notificationsRes.json(),
        statsRes.json(),
      ])

      if (bookingsData.bookings) setUpcomingBookings(bookingsData.bookings)
      if (recordingsData.recordings) setRecentRecordings(recordingsData.recordings)
      if (notificationsData.notifications) setNotifications(notificationsData.notifications)
      if (statsData) setStats(statsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'destructive'> = {
      CONFIRMED: 'success',
      PENDING: 'warning',
      COMPLETED: 'info',
      CANCELLED: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  // Get dates with bookings for calendar highlighting
  const bookedDates = upcomingBookings.map((b) => new Date(b.scheduledDate))

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">
            Welcome Back! 🎵
          </h1>
          <p className="text-charcoal-500 mt-1">
            Here's an overview of your musical journey
          </p>
        </div>
        <Link href="/dashboard/book">
          <Button className="gap-2">
            <Calendar className="w-5 h-5" />
            Book a Lesson
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Lessons', value: stats.totalLessons, icon: BookOpen, color: 'bg-blue-500' },
          { label: 'Upcoming', value: stats.upcomingLessons, icon: Calendar, color: 'bg-coral-500' },
          { label: 'Completed', value: stats.completedLessons, icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Hours Learned', value: stats.hoursLearned, icon: Clock, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-charcoal-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-charcoal-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-coral-500" />
                My Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersStyles={{
                  booked: {
                    backgroundColor: 'rgb(239 68 68 / 0.1)',
                    color: '#ef4444',
                    fontWeight: 'bold',
                  },
                }}
                className="rounded-xl border"
              />
              <div className="mt-4 flex items-center gap-4 text-sm text-charcoal-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-coral-100 rounded-full" />
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-coral-500 rounded-full" />
                  <span>Selected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-coral-500" />
                Upcoming Lessons
              </CardTitle>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-charcoal-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                  <p className="text-charcoal-500 mb-4">No upcoming lessons</p>
                  <Link href="/dashboard/book">
                    <Button>Book Your First Lesson</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 bg-charcoal-50 rounded-xl hover:bg-charcoal-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-2xl">
                        {booking.instrument.icon || getInstrumentEmoji(booking.instrument.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal-900">{booking.lesson.title}</h4>
                        <p className="text-sm text-charcoal-500">
                          {formatDate(booking.scheduledDate, 'EEE, MMM d')} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Recordings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-coral-500" />
              Shared Recordings
            </CardTitle>
            <Link href="/dashboard/recordings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video bg-charcoal-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentRecordings.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No recordings shared yet</p>
                <p className="text-sm text-charcoal-400 mt-1">
                  Your instructor will share class recordings here
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {recentRecordings.map((recording, index) => (
                  <motion.a
                    key={recording.id}
                    href={recording.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="aspect-video bg-charcoal-200 rounded-xl relative overflow-hidden">
                      {recording.thumbnailUrl && (
                        <img
                          src={recording.thumbnailUrl}
                          alt={recording.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 bg-coral-500 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      {recording.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {recording.duration}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-charcoal-900 mt-3 group-hover:text-coral-500 transition-colors">
                      {recording.title}
                    </h4>
                    <p className="text-sm text-charcoal-500">
                      {recording.instrument?.name} • {formatDate(recording.recordedAt, 'MMM d, yyyy')}
                    </p>
                  </motion.a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-coral-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-center text-charcoal-500 py-4">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl ${notif.isRead ? 'bg-charcoal-50' : 'bg-coral-50 border border-coral-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-charcoal-900">{notif.title}</h4>
                        <p className="text-sm text-charcoal-500 mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-charcoal-400">
                        {formatDate(notif.createdAt, 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
