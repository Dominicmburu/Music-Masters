'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'

interface TimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

interface Lesson {
  id: string
  title: string
  instrument: { name: string; icon: string | null }
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function LessonTimeSlotsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newSlot, setNewSlot] = useState({ dayOfWeek: '1', startTime: '09:00', endTime: '10:00' })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [lessonRes, slotsRes] = await Promise.all([
        fetch(`/api/admin/lessons/${id}`),
        fetch(`/api/admin/lessons/${id}/timeslots`),
      ])

      if (lessonRes.ok) {
        const lessonData = await lessonRes.json()
        setLesson(lessonData.lesson)
      } else {
        toast.error('Lesson not found')
        router.push('/admin/lessons')
        return
      }

      if (slotsRes.ok) {
        const slotsData = await slotsRes.json()
        setTimeSlots(slotsData.timeSlots || [])
      }
    } catch (error) {
      toast.error('Failed to load data')
      router.push('/admin/lessons')
    } finally {
      setLoading(false)
    }
  }

  const addTimeSlot = async () => {
    setAdding(true)
    try {
      const res = await fetch(`/api/admin/lessons/${id}/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: newSlot.dayOfWeek,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
        }),
      })

      if (res.ok) {
        toast.success('Time slot added')
        const slotsRes = await fetch(`/api/admin/lessons/${id}/timeslots`)
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json()
          setTimeSlots(slotsData.timeSlots || [])
        }
        setNewSlot({ dayOfWeek: '1', startTime: '09:00', endTime: '10:00' })
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to add slot')
      }
    } catch (error) {
      toast.error('Failed to add time slot')
    } finally {
      setAdding(false)
    }
  }

  const deleteTimeSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to remove this time slot?')) return

    try {
      const res = await fetch(`/api/admin/lessons/${id}/timeslots?slotId=${slotId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Time slot removed')
        setTimeSlots(timeSlots.filter(s => s.id !== slotId))
      } else {
        toast.error('Failed to remove time slot')
      }
    } catch (error) {
      toast.error('Failed to remove time slot')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    )
  }

  if (!lesson) return null

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Time Slots</h1>
            <p className="text-charcoal-500">{lesson.title}</p>
          </div>
        </div>

        {/* Add New Slot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-coral-500" />
              Add New Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <select
                    value={newSlot.dayOfWeek}
                    onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {DAYS.map((day, i) => (
                      <option key={i} value={i.toString()}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addTimeSlot} disabled={adding} className="gap-2">
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Time Slot
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-coral-500" />
              Current Time Slots ({timeSlots.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No time slots configured</p>
                <p className="text-sm text-charcoal-400">Add time slots above to define when this lesson is available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-charcoal-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={slot.isActive ? 'success' : 'secondary'} className="min-w-[100px] justify-center">
                        {DAYS[slot.dayOfWeek]}
                      </Badge>
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTimeSlot(slot.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove Slot</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Link href="/admin/lessons">
            <Button variant="outline">Back to Lessons</Button>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  )
}
