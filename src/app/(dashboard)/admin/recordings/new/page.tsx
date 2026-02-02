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
import { getYouTubeThumbnail } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Instrument {
  id: string
  name: string
}

export default function NewRecordingPage() {
  const router = useRouter()
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    instrumentId: '',
    duration: '',
  })

  useEffect(() => {
    fetchInstruments()
  }, [])

  const fetchInstruments = async () => {
    try {
      const res = await fetch('/api/instruments')
      const data = await res.json()
      if (data.instruments) setInstruments(data.instruments)
    } catch (error) {
      console.error('Failed to load instruments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      toast.error('Title and YouTube URL are required')
      return
    }

    setSaving(true)
    try {
      const thumbnailUrl = getYouTubeThumbnail(formData.youtubeUrl)
      const res = await fetch('/api/admin/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl,
          instrumentId: formData.instrumentId || null,
        }),
      })

      if (res.ok) {
        toast.success('Recording added successfully')
        router.push('/admin/recordings')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to add recording')
      }
    } catch (error) {
      toast.error('Failed to add recording')
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
        <Link href="/admin/recordings">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Add Recording</h1>
          <p className="text-charcoal-500">Add a new class recording</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recording Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Moonlight Sonata - Piano Technique"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL *</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-charcoal-400">Enter the full YouTube video URL</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instrument">Instrument</Label>
                <select
                  id="instrument"
                  value={formData.instrumentId}
                  onChange={(e) => setFormData({ ...formData, instrumentId: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">No Instrument</option>
                  {instruments.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45:30"
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
              <Link href="/admin/recordings">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Recording'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
