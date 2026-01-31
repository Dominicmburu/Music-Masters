'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Filter, MoreVertical, Check, X, Clock, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatTime, formatCurrency, getInitials, getInstrumentEmoji } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  scheduledDate: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  adminNotes: string | null
  user: { id: string; firstName: string; lastName: string; email: string; phone: string | null }
  lesson: { title: string; duration: number; price: number }
  instrument: { name: string; icon: string }
  payment: { status: string; amount: number } | null
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings?limit=200')
      const data = await res.json()
      if (data.bookings) setBookings(data.bookings)
    } catch (error) { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b))
      toast.success(`Booking marked as ${status}`)
    } catch (error) { toast.error('Failed to update booking') }
    finally { setUpdating(false) }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
      CONFIRMED: 'success', PENDING: 'warning', COMPLETED: 'info', CANCELLED: 'destructive', NO_SHOW: 'secondary',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const upcomingBookings = filteredBookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.scheduledDate) >= new Date())
  const pastBookings = filteredBookings.filter(b => !(['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.scheduledDate) >= new Date()))

  const BookingRow = ({ booking }: { booking: Booking }) => (
    <tr className="border-b border-charcoal-50 hover:bg-charcoal-50 transition-colors">
      <td className="table-cell">
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback className="bg-coral-100 text-coral-600 text-sm">{getInitials(booking.user.firstName, booking.user.lastName)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium text-charcoal-900">{booking.user.firstName} {booking.user.lastName}</p>
            <p className="text-sm text-charcoal-500">{booking.user.email}</p>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <div className="flex items-center gap-2">
          <span className="text-xl">{booking.instrument.icon || getInstrumentEmoji(booking.instrument.name)}</span>
          <div>
            <p className="font-medium">{booking.lesson.title}</p>
            <p className="text-sm text-charcoal-500">{booking.instrument.name}</p>
          </div>
        </div>
      </td>
      <td className="table-cell">
        <p className="font-medium">{formatDate(booking.scheduledDate, 'MMM d, yyyy')}</p>
        <p className="text-sm text-charcoal-500">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
      </td>
      <td className="table-cell">{getStatusBadge(booking.status)}</td>
      <td className="table-cell font-medium">{formatCurrency(booking.lesson.price)}</td>
      <td className="table-cell text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedBooking(booking); setShowDetailsDialog(true) }}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            {booking.status === 'PENDING' && (
              <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}><Check className="w-4 h-4 mr-2 text-green-600" />Confirm</DropdownMenuItem>
            )}
            {['PENDING', 'CONFIRMED'].includes(booking.status) && (
              <>
                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}><Check className="w-4 h-4 mr-2 text-blue-600" />Mark Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'NO_SHOW')}><Clock className="w-4 h-4 mr-2 text-orange-600" />Mark No-Show</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'CANCELLED')} className="text-red-600"><X className="w-4 h-4 mr-2" />Cancel</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Bookings</h1>
          <p className="text-charcoal-500 mt-1">Manage all lesson bookings</p>
        </div>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input placeholder="Search by student or lesson..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-[180px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Tabs defaultValue="upcoming">
        <TabsList><TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger><TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger></TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 space-y-4">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-charcoal-100 rounded animate-pulse" />)}</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-16"><Calendar className="w-16 h-16 text-charcoal-300 mx-auto mb-4" /><p className="text-charcoal-500">No upcoming bookings</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-charcoal-200"><th className="table-header">Student</th><th className="table-header">Lesson</th><th className="table-header">Date & Time</th><th className="table-header">Status</th><th className="table-header">Price</th><th className="table-header text-right">Actions</th></tr></thead>
                    <tbody>{upcomingBookings.map((booking) => <BookingRow key={booking.id} booking={booking} />)}</tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardContent className="p-0">
              {pastBookings.length === 0 ? (
                <div className="text-center py-16"><p className="text-charcoal-500">No past bookings</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-charcoal-200"><th className="table-header">Student</th><th className="table-header">Lesson</th><th className="table-header">Date & Time</th><th className="table-header">Status</th><th className="table-header">Price</th><th className="table-header text-right">Actions</th></tr></thead>
                    <tbody>{pastBookings.map((booking) => <BookingRow key={booking.id} booking={booking} />)}</tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-charcoal-50 rounded-xl">
                <Avatar className="w-12 h-12"><AvatarFallback className="bg-coral-100 text-coral-600">{getInitials(selectedBooking.user.firstName, selectedBooking.user.lastName)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold">{selectedBooking.user.firstName} {selectedBooking.user.lastName}</p>
                  <p className="text-sm text-charcoal-500">{selectedBooking.user.email}</p>
                  {selectedBooking.user.phone && <p className="text-sm text-charcoal-500">{selectedBooking.user.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-charcoal-500">Lesson</p><p className="font-medium">{selectedBooking.lesson.title}</p></div>
                <div><p className="text-sm text-charcoal-500">Instrument</p><p className="font-medium">{selectedBooking.instrument.name}</p></div>
                <div><p className="text-sm text-charcoal-500">Date</p><p className="font-medium">{formatDate(selectedBooking.scheduledDate, 'EEEE, MMMM d, yyyy')}</p></div>
                <div><p className="text-sm text-charcoal-500">Time</p><p className="font-medium">{formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p></div>
                <div><p className="text-sm text-charcoal-500">Status</p>{getStatusBadge(selectedBooking.status)}</div>
                <div><p className="text-sm text-charcoal-500">Price</p><p className="font-medium">{formatCurrency(selectedBooking.lesson.price)}</p></div>
              </div>
              {selectedBooking.notes && <div><p className="text-sm text-charcoal-500">Student Notes</p><p className="text-sm bg-charcoal-50 p-3 rounded-lg">{selectedBooking.notes}</p></div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
