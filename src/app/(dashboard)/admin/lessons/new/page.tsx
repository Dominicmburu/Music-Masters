'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

interface Instrument {
  id: string
  name: string
  icon: string | null
  isActive: boolean
}

const LESSON_TYPES = [
  { value: 'PRIVATE', label: 'Private (1-on-1)' },
  { value: 'GROUP', label: 'Group Lesson' },
  { value: 'ONLINE', label: 'Online Lesson' },
]

export default function NewLessonPage() {
  const router = useRouter()
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instrumentId: '',
    lessonType: 'PRIVATE',
    duration: '60',
    price: '',
    maxStudents: '1',
  })

  useEffect(() => {
    fetchInstruments()
  }, [])

  const fetchInstruments = async () => {
    try {
      const res = await fetch('/api/admin/instruments')
      const data = await res.json()
      if (data.instruments) {
        const activeInstruments = data.instruments.filter((i: Instrument) => i.isActive)
        setInstruments(activeInstruments)
        if (activeInstruments.length > 0) {
          setFormData(prev => ({ ...prev, instrumentId: activeInstruments[0].id }))
        }
      }
    } catch (error) {
      toast.error('Failed to load instruments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.instrumentId || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          maxStudents: parseInt(formData.maxStudents),
        }),
      })

      if (res.ok) {
        toast.success('Lesson created successfully')
        router.push('/admin/lessons')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create lesson')
      }
    } catch (error) {
      toast.error('Failed to create lesson')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lessons">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Add Lesson</h1>
          <p className="text-charcoal-500">Create a new lesson offering</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Instrument *</Label>
              <select
                value={formData.instrumentId}
                onChange={(e) => setFormData({ ...formData, instrumentId: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select instrument</option>
                {instruments.map((i) => (
                  <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Beginner Piano Lessons"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lesson Type *</Label>
                <select
                  value={formData.lessonType}
                  onChange={(e) => setFormData({ ...formData, lessonType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (KSh) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the lesson..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/lessons">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Lesson'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
