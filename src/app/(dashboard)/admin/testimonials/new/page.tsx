'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Star, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function NewTestimonialPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    studentName: '',
    content: '',
    rating: 5,
    avatar: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.studentName.trim() || !formData.content.trim()) {
      toast.error('Name and content are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Testimonial created successfully')
        router.push('/admin/testimonials')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create testimonial')
      }
    } catch (error) {
      toast.error('Failed to create testimonial')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Add Testimonial</h1>
          <p className="text-charcoal-500">Create a new student testimonial</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={formData.avatar || undefined} />
                <AvatarFallback className="bg-coral-100 text-coral-600 text-2xl">
                  {formData.studentName
                    ? getInitials(formData.studentName.split(' ')[0], formData.studentName.split(' ')[1] || '')
                    : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </Button>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                    className="ml-2 text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <p className="text-xs text-charcoal-400 mt-1">Optional, max 2MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-charcoal-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Testimonial *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="What did the student say about their experience?"
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/testimonials">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Testimonial'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
