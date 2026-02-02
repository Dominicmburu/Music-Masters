'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Search, Edit, Trash2, Clock, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/utils'
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
  description: string | null
  instrumentId: string
  lessonType: string
  duration: number
  price: number
  maxStudents: number
  isActive: boolean
  instrument: { id: string; name: string; icon: string | null }
  timeSlots: TimeSlot[]
  _count: { bookings: number }
}

interface Instrument {
  id: string
  name: string
  icon: string | null
}

const LESSON_TYPES = [
  { value: 'PRIVATE', label: 'Private (1-on-1)' },
  { value: 'GROUP', label: 'Group Lesson' },
  { value: 'ONLINE', label: 'Online Lesson' },
]

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterInstrument, setFilterInstrument] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [lessonsRes, instrumentsRes] = await Promise.all([
        fetch('/api/admin/lessons'),
        fetch('/api/admin/instruments'),
      ])
      const [lessonsData, instrumentsData] = await Promise.all([
        lessonsRes.json(),
        instrumentsRes.json(),
      ])
      if (lessonsData.lessons) setLessons(lessonsData.lessons)
      if (instrumentsData.instruments) setInstruments(instrumentsData.instruments.filter((i: Instrument & { isActive: boolean }) => i.isActive))
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (lesson: Lesson) => {
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !lesson.isActive }),
      })

      if (res.ok) {
        setLessons(lessons.map(l =>
          l.id === lesson.id ? { ...l, isActive: !l.isActive } : l
        ))
        toast.success(`Lesson ${!lesson.isActive ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      toast.error('Failed to update lesson')
    }
  }

  const handleDelete = async (lesson: Lesson) => {
    if (!confirm(`Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Lesson deleted')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete lesson')
      }
    } catch (error) {
      toast.error('Failed to delete lesson')
    }
  }

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesInstrument = filterInstrument === 'all' || l.instrumentId === filterInstrument
    return matchesSearch && matchesInstrument
  })

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Lessons</h1>
            <p className="text-charcoal-500 mt-1">Manage lesson types and pricing</p>
          </div>
          <Link href="/admin/lessons/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Add Lesson
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <Input
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <select
                value={filterInstrument}
                onChange={(e) => setFilterInstrument(e.target.value)}
                className="w-[200px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Instruments</option>
                {instruments.map((i) => (
                  <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-coral-500" />
              All Lessons ({filteredLessons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No lessons found</p>
                <Link href="/admin/lessons/new">
                  <Button className="mt-4">Add Your First Lesson</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Time Slots</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lesson.instrument.icon || '🎵'}</span>
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-charcoal-500">{lesson.instrument.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {LESSON_TYPES.find(t => t.value === lesson.lessonType)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{lesson.duration} min</TableCell>
                      <TableCell className="font-medium">{formatCurrency(lesson.price)}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/lessons/${lesson.id}/timeslots`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.timeSlots.length} slots
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Manage Time Slots</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lesson.isActive ? 'success' : 'destructive'}>
                          {lesson.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => toggleActive(lesson)}>
                                {lesson.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-charcoal-400" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{lesson.isActive ? 'Deactivate' : 'Activate'}</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/lessons/${lesson.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="w-5 h-5" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(lesson)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
