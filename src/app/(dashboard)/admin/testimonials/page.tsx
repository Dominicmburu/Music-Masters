'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Quote, Plus, Search, Edit, Trash2, Star, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Testimonial {
  id: string
  studentName: string
  content: string
  rating: number
  avatar: string | null
  isActive: boolean
  createdAt: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      if (data.testimonials) setTestimonials(data.testimonials)
    } catch (error) {
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !testimonial.isActive }),
      })

      if (res.ok) {
        setTestimonials(testimonials.map(t =>
          t.id === testimonial.id ? { ...t, isActive: !t.isActive } : t
        ))
        toast.success(`Testimonial ${!testimonial.isActive ? 'shown' : 'hidden'}`)
      }
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`Are you sure you want to delete "${testimonial.studentName}"'s testimonial?`)) return

    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Testimonial deleted')
        setTestimonials(testimonials.filter(t => t.id !== testimonial.id))
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const filteredTestimonials = testimonials.filter(t =>
    t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-charcoal-300'}`}
      />
    ))
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Testimonials</h1>
            <p className="text-charcoal-500 mt-1">Manage student testimonials displayed on the website</p>
          </div>
          <Link href="/admin/testimonials/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Add Testimonial
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="text-center py-12">
                <Quote className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No testimonials found</p>
                <Link href="/admin/testimonials/new">
                  <Button className="mt-4">Add Your First Testimonial</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`${!testimonial.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar || undefined} />
                        <AvatarFallback className="bg-coral-100 text-coral-600">
                          {getInitials(testimonial.studentName.split(' ')[0], testimonial.studentName.split(' ')[1] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-charcoal-900">{testimonial.studentName}</p>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <Badge variant={testimonial.isActive ? 'success' : 'secondary'}>
                      {testimonial.isActive ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>

                  <Quote className="w-6 h-6 text-coral-300 mb-2" />
                  <p className="text-charcoal-600 mb-4 line-clamp-4">{testimonial.content}</p>

                  <div className="flex items-center justify-end gap-1 pt-4 border-t">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => toggleActive(testimonial)}>
                          {testimonial.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-charcoal-400" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{testimonial.isActive ? 'Hide' : 'Show'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
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
                          onClick={() => handleDelete(testimonial)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
