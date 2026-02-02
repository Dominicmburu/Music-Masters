'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

const EMOJI_OPTIONS = ['🎹', '🎸', '🥁', '🎻', '🎺', '🎷', '🪕', '🪗', '🎤', '🎵']

export default function EditInstrumentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎵',
  })

  useEffect(() => {
    fetchInstrument()
  }, [id])

  const fetchInstrument = async () => {
    try {
      const res = await fetch(`/api/admin/instruments/${id}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.instrument.name,
          description: data.instrument.description || '',
          icon: data.instrument.icon || '🎵',
        })
      } else {
        toast.error('Instrument not found')
        router.push('/admin/instruments')
      }
    } catch (error) {
      toast.error('Failed to load instrument')
      router.push('/admin/instruments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/instruments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Instrument updated successfully')
        router.push('/admin/instruments')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update instrument')
      }
    } catch (error) {
      toast.error('Failed to update instrument')
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
        <Link href="/admin/instruments">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Edit Instrument</h1>
          <p className="text-charcoal-500">Update instrument details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instrument Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-colors ${
                      formData.icon === emoji
                        ? 'border-coral-500 bg-coral-50'
                        : 'border-charcoal-200 hover:border-charcoal-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Piano"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this instrument..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/instruments">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
