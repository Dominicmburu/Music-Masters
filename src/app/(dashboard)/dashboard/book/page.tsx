'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Music, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { formatDate, formatTime, formatCurrency, getInstrumentEmoji } from '@/lib/utils'
import { addDays, format, isBefore, startOfDay } from 'date-fns'
import toast from 'react-hot-toast'

interface Instrument { id: string; name: string; icon: string; description: string }
interface Lesson { id: string; title: string; description: string; duration: number; price: number; lessonType: 'PRIVATE' | 'GROUP'; maxStudents: number; instrument: Instrument }
interface TimeSlot { id: string; startTime: string; endTime: string; isAvailable: boolean }

const steps = [
  { id: 1, title: 'Select Instrument', icon: Music },
  { id: 2, title: 'Choose Lesson', icon: Calendar },
  { id: 3, title: 'Pick Date & Time', icon: Clock },
  { id: 4, title: 'Confirm Booking', icon: Check },
]

export default function BookLessonPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { fetchInstruments() }, [])
  useEffect(() => { if (selectedInstrument) fetchLessons(selectedInstrument.id) }, [selectedInstrument])
  useEffect(() => { if (selectedLesson && selectedDate) fetchAvailableSlots(selectedLesson.id, selectedDate) }, [selectedLesson, selectedDate])

  const fetchInstruments = async () => {
    try {
      const res = await fetch('/api/instruments')
      const data = await res.json()
      if (data.instruments) setInstruments(data.instruments)
    } catch (error) { toast.error('Failed to load instruments') }
    finally { setLoading(false) }
  }

  const fetchLessons = async (instrumentId: string) => {
    try {
      const res = await fetch(`/api/lessons?instrumentId=${instrumentId}`)
      const data = await res.json()
      if (data.lessons) setLessons(data.lessons)
    } catch (error) { toast.error('Failed to load lessons') }
  }

  const fetchAvailableSlots = async (lessonId: string, date: Date) => {
    try {
      const res = await fetch(`/api/bookings/available-slots?lessonId=${lessonId}&date=${format(date, 'yyyy-MM-dd')}`)
      const data = await res.json()
      if (data.slots) setAvailableSlots(data.slots)
    } catch (error) { toast.error('Failed to load available slots') }
  }

  const handleBooking = async () => {
    if (!selectedLesson || !selectedDate || !selectedSlot) return
    setBooking(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          instrumentId: selectedInstrument?.id,
          scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          timeSlotId: selectedSlot.id,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      toast.success('Lesson booked successfully!')
      router.push('/dashboard/bookings')
    } catch (error: any) { toast.error(error.message) }
    finally { setBooking(false) }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedInstrument
      case 2: return !!selectedLesson
      case 3: return !!selectedDate && !!selectedSlot
      default: return true
    }
  }

  const goNext = () => { if (canProceed() && currentStep < 4) setCurrentStep(currentStep + 1) }
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-charcoal-900">Book a Lesson</h1>
        <p className="text-charcoal-500 mt-1">Schedule your next music lesson in a few simple steps</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-charcoal-200" />
        <div className="absolute top-5 left-0 h-0.5 bg-coral-500 transition-all duration-300" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
        {steps.map((step) => (
          <div key={step.id} className="relative flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id ? 'bg-coral-500 text-white' : 'bg-charcoal-200 text-charcoal-500'}`}>
              {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-coral-500' : 'text-charcoal-400'}`}>{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {/* Step 1: Select Instrument */}
          {currentStep === 1 && (
            <Card>
              <CardHeader><CardTitle>Select Your Instrument</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-32 bg-charcoal-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {instruments.map((instrument) => (
                      <button key={instrument.id} onClick={() => setSelectedInstrument(instrument)}
                        className={`p-6 rounded-xl border-2 transition-all text-left hover:border-coral-300 ${selectedInstrument?.id === instrument.id ? 'border-coral-500 bg-coral-50' : 'border-charcoal-200'}`}>
                        <span className="text-4xl block mb-3">{instrument.icon || getInstrumentEmoji(instrument.name)}</span>
                        <h3 className="font-semibold text-charcoal-900">{instrument.name}</h3>
                        <p className="text-sm text-charcoal-500 mt-1">{instrument.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Choose Lesson */}
          {currentStep === 2 && (
            <Card>
              <CardHeader><CardTitle>Choose Your Lesson Type</CardTitle></CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                    <p className="text-charcoal-500">No lessons available for this instrument</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson) => (
                      <button key={lesson.id} onClick={() => setSelectedLesson(lesson)}
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left hover:border-coral-300 ${selectedLesson?.id === lesson.id ? 'border-coral-500 bg-coral-50' : 'border-charcoal-200'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-charcoal-900">{lesson.title}</h3>
                              <Badge variant={lesson.lessonType === 'PRIVATE' ? 'default' : 'secondary'}>{lesson.lessonType}</Badge>
                            </div>
                            <p className="text-sm text-charcoal-500 mt-1">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-charcoal-500">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{lesson.duration} min</span>
                              {lesson.lessonType === 'GROUP' && <span>Max {lesson.maxStudents} students</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-charcoal-900">{formatCurrency(lesson.price)}</span>
                            <span className="text-charcoal-500 text-sm block">/session</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pick Date & Time */}
          {currentStep === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
                <CardContent>
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null) }}
                    disabled={(date) => isBefore(date, startOfDay(new Date())) || date.getDay() === 0} className="rounded-xl border" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Available Time Slots</CardTitle></CardHeader>
                <CardContent>
                  {!selectedDate ? (
                    <div className="text-center py-8 text-charcoal-500">Please select a date first</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                      <p className="text-charcoal-500">No slots available for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot) => (
                        <button key={slot.id} onClick={() => slot.isAvailable && setSelectedSlot(slot)} disabled={!slot.isAvailable}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${!slot.isAvailable ? 'border-charcoal-100 text-charcoal-300 cursor-not-allowed bg-charcoal-50' : selectedSlot?.id === slot.id ? 'border-coral-500 bg-coral-50 text-coral-600' : 'border-charcoal-200 hover:border-coral-300'}`}>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {currentStep === 4 && (
            <Card>
              <CardHeader><CardTitle>Confirm Your Booking</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-charcoal-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500">Instrument</span>
                    <span className="font-semibold flex items-center gap-2">{selectedInstrument?.icon} {selectedInstrument?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500">Lesson</span>
                    <span className="font-semibold">{selectedLesson?.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500">Date</span>
                    <span className="font-semibold">{selectedDate && formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500">Time</span>
                    <span className="font-semibold">{selectedSlot && `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500">Duration</span>
                    <span className="font-semibold">{selectedLesson?.duration} minutes</span>
                  </div>
                  <div className="border-t border-charcoal-200 pt-4 flex items-center justify-between">
                    <span className="text-charcoal-900 font-semibold">Total</span>
                    <span className="text-2xl font-bold text-coral-500">{selectedLesson && formatCurrency(selectedLesson.price)}</span>
                  </div>
                </div>
                <Textarea label="Additional Notes (optional)" placeholder="Any special requests or information..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Cancellation Policy:</strong> You can cancel or reschedule your lesson up to 24 hours before the scheduled time.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goBack} disabled={currentStep === 1} className="gap-2">
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        {currentStep < 4 ? (
          <Button onClick={goNext} disabled={!canProceed()} className="gap-2">
            Continue <ChevronRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button onClick={handleBooking} loading={booking} className="gap-2">
            <Check className="w-5 h-5" /> Confirm Booking
          </Button>
        )}
      </div>
    </div>
  )
}
