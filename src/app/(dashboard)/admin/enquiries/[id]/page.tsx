'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Send, Mail, Phone, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  response: string | null
  repliedAt: string | null
  createdAt: string
}

export default function ViewEnquiryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnquiry()
  }, [id])

  const fetchEnquiry = async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEnquiry(data.enquiry)

        // Mark as read if not already
        if (!data.enquiry.isRead) {
          await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
          })
        }
      } else {
        toast.error('Enquiry not found')
        router.push('/admin/enquiries')
      }
    } catch (error) {
      toast.error('Failed to load enquiry')
      router.push('/admin/enquiries')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = () => {
    if (!enquiry) return null
    if (enquiry.response) {
      return <Badge className="bg-green-100 text-green-700">Replied</Badge>
    }
    if (!enquiry.isRead) {
      return <Badge className="bg-blue-100 text-blue-700">New</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    )
  }

  if (!enquiry) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/enquiries">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Enquiry Details</h1>
            <p className="text-charcoal-500">{enquiry.subject}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal-500">Name</p>
                <p className="font-medium text-charcoal-900">{enquiry.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal-500">Email</p>
                <a href={`mailto:${enquiry.email}`} className="font-medium text-coral-600 hover:underline">
                  {enquiry.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal-500">Phone</p>
                <p className="font-medium text-charcoal-900">{enquiry.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal-500">Received</p>
                <p className="font-medium text-charcoal-900">{formatDate(enquiry.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle>Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-charcoal-50 rounded-lg whitespace-pre-wrap text-charcoal-700">
            {enquiry.message}
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      {enquiry.response && (
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg whitespace-pre-wrap text-charcoal-700">
              {enquiry.response}
            </div>
            {enquiry.repliedAt && (
              <p className="text-sm text-charcoal-500 mt-3">
                Replied on {formatDate(enquiry.repliedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href="/admin/enquiries">
          <Button variant="outline">Back to List</Button>
        </Link>
        {!enquiry.response && (
          <Link href={`/admin/enquiries/${enquiry.id}/reply`}>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Reply
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
