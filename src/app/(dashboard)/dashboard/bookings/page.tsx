'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, Music, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate, formatTime, formatCurrency, getInstrumentEmoji } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  scheduledDate: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  lesson: { title: string; duration: number; price: number }
  instrument: { name: string; icon: string }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      if (data.bookings) setBookings(data.bookings)
    } catch (error) { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  const handleCancel = async (booking: Booking) => {
    const confirmMsg = `Are you sure you want to cancel your "${booking.lesson.title}" lesson on ${formatDate(booking.scheduledDate, 'MMMM d, yyyy')}?\n\nNote: Cancellations must be made at least 24 hours before the lesson.`
    if (!confirm(confirmMsg)) return

    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to cancel')
      setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b))
      toast.success('Booking cancelled successfully')
    } catch (error) { toast.error('Failed to cancel booking') }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'info' | 'destructive'; icon: any }> = {
      CONFIRMED: { variant: 'success', icon: CheckCircle },
      PENDING: { variant: 'warning', icon: Clock },
      COMPLETED: { variant: 'info', icon: CheckCircle },
      CANCELLED: { variant: 'destructive', icon: XCircle },
      NO_SHOW: { variant: 'destructive', icon: AlertCircle },
    }
    const { variant, icon: Icon } = config[status] || { variant: 'secondary', icon: Clock }
    return <Badge variant={variant} className="gap-1"><Icon className="w-3 h-3" />{status}</Badge>
  }

  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.scheduledDate) >= new Date())
  const pastBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status) || new Date(b.scheduledDate) < new Date())

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="flex items-center gap-4 p-4 bg-charcoal-50 rounded-xl hover:bg-charcoal-100 transition-colors">
      <div className="w-14 h-14 bg-coral-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
        {booking.instrument.icon || getInstrumentEmoji(booking.instrument.name)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-charcoal-900 truncate">{booking.lesson.title}</h4>
        <p className="text-sm text-charcoal-500">
          {formatDate(booking.scheduledDate, 'EEE, MMM d, yyyy')} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
        </p>
        <p className="text-sm text-charcoal-400">{booking.instrument.name} • {booking.lesson.duration} min</p>
      </div>
      <div className="text-right shrink-0">
        {getStatusBadge(booking.status)}
        <p className="text-sm font-medium text-charcoal-900 mt-1">{formatCurrency(booking.lesson.price)}</p>
      </div>
      {['PENDING', 'CONFIRMED'].includes(booking.status) && new Date(booking.scheduledDate) >= new Date() && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCancel(booking)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cancel Booking</TooltipContent>
        </Tooltip>
      )}
    </div>
  )

  return (
    <TooltipProvider>
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">My Bookings</h1>
          <p className="text-charcoal-500 mt-1">View and manage your lesson bookings</p>
        </div>
        <Link href="/dashboard/book"><Button className="gap-2"><Calendar className="w-5 h-5" />Book New Lesson</Button></Link>
      </motion.div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-coral-500" />Upcoming Lessons</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-charcoal-100 rounded-xl animate-pulse" />)}</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                  <p className="text-charcoal-500 mb-4">No upcoming lessons</p>
                  <Link href="/dashboard/book"><Button>Book a Lesson</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">{upcomingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-charcoal-500" />Past Lessons</CardTitle></CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <p className="text-center text-charcoal-500 py-12">No past bookings</p>
              ) : (
                <div className="space-y-3">{pastBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  )
}
