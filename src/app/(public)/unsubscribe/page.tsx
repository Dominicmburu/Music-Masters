'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      setStatus('error')
      setMessage('Invalid unsubscribe link')
      return
    }

    processUnsubscribe(email, token)
  }, [searchParams])

  const processUnsubscribe = async (email: string, token: string) => {
    try {
      const res = await fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`)
      const data = await res.json()

      if (res.ok) {
        if (data.message === 'Already unsubscribed') {
          setStatus('already')
          setMessage('You have already unsubscribed from our newsletter.')
        } else {
          setStatus('success')
          setMessage('You have been successfully unsubscribed from our newsletter.')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <main className="min-h-screen bg-charcoal-50">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-16 h-16 animate-spin text-coral-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Processing...</h1>
                  <p className="text-charcoal-600">Please wait while we process your request.</p>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Unsubscribed</h1>
                  <p className="text-charcoal-600 mb-6">{message}</p>
                  <p className="text-sm text-charcoal-500 mb-8">
                    We're sorry to see you go. You can always resubscribe from our website.
                  </p>
                  <Link href="/">
                    <Button>Return to Homepage</Button>
                  </Link>
                </>
              ) : status === 'already' ? (
                <>
                  <Mail className="w-16 h-16 text-charcoal-400 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Already Unsubscribed</h1>
                  <p className="text-charcoal-600 mb-8">{message}</p>
                  <Link href="/">
                    <Button>Return to Homepage</Button>
                  </Link>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Error</h1>
                  <p className="text-charcoal-600 mb-8">{message}</p>
                  <Link href="/">
                    <Button>Return to Homepage</Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-charcoal-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </main>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
