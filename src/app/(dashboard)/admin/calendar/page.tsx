'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatTime, getInitials, getInstrumentEmoji } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  scheduledDate: string
  startTime: string
  endTime: string
  status: string
  user: { firstName: string; lastName: string }
  lesson: { title: string }
  instrument: { name: string; icon: string }
}

export default function AdminCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    fetchBookings() 
  }, [currentMonth])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      const res = await fetch(`/api/admin/bookings?startDate=${start}&endDate=${end}`)
      const data = await res.json()
      if (data.bookings) {
        setBookings(data.bookings)
      }
    } catch (error) { 
      console.error('Failed to load bookings:', error)
      toast.error('Failed to load bookings') 
    } finally { 
      setLoading(false) 
    }
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => {
      const bookingDate = parseISO(b.scheduledDate)
      return isSameDay(bookingDate, date)
    })
  }

  const selectedDateBookings = useMemo(() => {
    return getBookingsForDate(selectedDate)
  }, [selectedDate, bookings])

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayBookings = getBookingsForDate(day)
        const isCurrentMonth = isSameMonth(day, currentMonth)
        const isSelected = isSameDay(day, selectedDate)
        const isToday = isSameDay(day, new Date())
        const currentDay = new Date(day)

        days.push(
          <div
            key={day.toISOString()}
            onClick={() => setSelectedDate(currentDay)}
            className={`min-h-[100px] p-2 border-b border-r border-charcoal-100 cursor-pointer transition-colors
              ${!isCurrentMonth ? 'bg-charcoal-50/50 text-charcoal-400' : 'hover:bg-coral-50/30'}
              ${isSelected ? 'bg-coral-50 ring-2 ring-coral-500 ring-inset' : ''}
              ${isToday && !isSelected ? 'bg-blue-50/50' : ''}`}
          >
            <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-coral-500 text-white' : ''}`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayBookings.slice(0, 2).map((booking) => (
                <div
                  key={booking.id}
                  className={`text-xs p-1.5 rounded truncate font-medium ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {formatTime(booking.startTime)} - {booking.user.firstName}
                </div>
              ))}
              {dayBookings.length > 2 && (
                <div className="text-xs text-coral-500 font-medium">+{dayBookings.length - 2} more</div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(<div key={day.toISOString()} className="grid grid-cols-7">{days}</div>)
      days = []
    }
    return rows
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Calendar</h1>
          <p className="text-charcoal-500 mt-1">Manage your lesson schedule</p>
        </div>
        <Link href="/admin/bookings">
          <Button className="gap-2"><Plus className="w-5 h-5" />View All Bookings</Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[180px] text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()) }}>Today</Button>
          </CardHeader>
          <CardContent className="p-0">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-charcoal-200 bg-charcoal-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-charcoal-600">{day}</div>
              ))}
            </div>
            {/* Calendar Grid */}
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-charcoal-500">Loading calendar...</span>
                </div>
              </div>
            ) : (
              <div className="border-l border-charcoal-100">{renderCalendar()}</div>
            )}
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="w-5 h-5 text-coral-500" />
              {format(selectedDate, 'EEEE, MMM d')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-charcoal-200 mx-auto mb-3" />
                <p className="text-charcoal-500 text-sm">No lessons scheduled</p>
                <p className="text-charcoal-400 text-xs mt-1">Click on a date to view bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-charcoal-500 font-medium">{selectedDateBookings.length} lesson{selectedDateBookings.length > 1 ? 's' : ''} scheduled</p>
                {selectedDateBookings.map((booking) => (
                  <div key={booking.id} className="p-3 bg-charcoal-50 rounded-xl hover:bg-charcoal-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-coral-100 text-coral-600">
                          {getInitials(booking.user.firstName, booking.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{booking.user.firstName} {booking.user.lastName}</p>
                        <p className="text-xs text-charcoal-500">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-charcoal-500 flex items-center gap-1">
                        <span>{booking.instrument.icon || getInstrumentEmoji(booking.instrument.name)}</span>
                        <span className="truncate">{booking.lesson.title}</span>
                      </span>
                      <Badge 
                        variant={
                          booking.status === 'CONFIRMED' ? 'success' : 
                          booking.status === 'PENDING' ? 'warning' : 
                          booking.status === 'COMPLETED' ? 'info' : 'secondary'
                        } 
                        className="text-xs shrink-0"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
              <span className="text-charcoal-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
              <span className="text-charcoal-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
              <span className="text-charcoal-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
              <span className="text-charcoal-600">Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
