'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

interface Enquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  response: string | null
}

export default function ReplyEnquiryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sendEmail, setSendEmail] = useState(true)

  useEffect(() => {
    fetchEnquiry()
  }, [id])

  const fetchEnquiry = async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEnquiry(data.enquiry)
        if (data.enquiry.response) {
          setReplyText(data.enquiry.response)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyText.trim()) {
      toast.error('Please enter a response')
      return
    }

    setSending(true)
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: replyText,
          sendEmail,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.warning || 'Response sent successfully')
        router.push('/admin/enquiries')
      } else {
        toast.error(data.error || 'Failed to send response')
      }
    } catch (error) {
      toast.error('Failed to send response')
    } finally {
      setSending(false)
    }
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
      <div className="flex items-center gap-4">
        <Link href={`/admin/enquiries/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Reply to Enquiry</h1>
          <p className="text-charcoal-500">Send a response to {enquiry.name}</p>
        </div>
      </div>

      {/* Original Message */}
      <Card>
        <CardHeader>
          <CardTitle>Original Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-charcoal-500">From</p>
              <p className="font-medium">{enquiry.name} ({enquiry.email})</p>
            </div>
            <div>
              <p className="text-sm text-charcoal-500">Subject</p>
              <p className="font-medium">{enquiry.subject}</p>
            </div>
            <div>
              <p className="text-sm text-charcoal-500">Message</p>
              <div className="mt-1 p-4 bg-charcoal-50 rounded-lg whitespace-pre-wrap text-charcoal-700">
                {enquiry.message}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Response</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reply">Response *</Label>
              <Textarea
                id="reply"
                placeholder="Type your response here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={10}
                className="resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="sendEmail"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="sendEmail" className="font-normal">
                Send response via email to {enquiry.email}
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href={`/admin/enquiries/${id}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={sending} className="gap-2">
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Response
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
