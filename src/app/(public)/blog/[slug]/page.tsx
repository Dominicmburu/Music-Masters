'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Share2, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  category: { id: string; name: string; slug: string } | null
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/blog/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        if (data.post) {
          setPost(data.post)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-4xl font-bold text-charcoal-900 mb-4">Post Not Found</h1>
          <p className="text-charcoal-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const readTime = Math.ceil((post.content?.length || 0) / 1000) + ' min read'
  const publishDate = post.publishedAt || post.createdAt

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Back link */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-coral-400 hover:text-coral-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to all articles
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="pb-16 bg-gradient-to-b from-charcoal-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-6">
              {post.category && (
                <Badge className="bg-coral-500 hover:bg-coral-600 text-white">
                  {post.category.name}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-charcoal-400 text-sm">
                <Clock className="w-4 h-4" />
                {readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-charcoal-300 text-sm mb-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(publishDate, 'MMMM d, yyyy')}
              </div>
            </div>

            {post.featuredImage && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-12">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-charcoal-900 prose-p:text-charcoal-700 prose-li:text-charcoal-700 prose-a:text-coral-500">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Share */}
          <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-charcoal-100">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              Share this article
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-charcoal-900">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Enjoying the read?
          </h2>
          <p className="text-charcoal-400 mb-8 max-w-xl mx-auto">
            Get more tips and updates straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Link href="/blog" className="flex-1">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                View More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
