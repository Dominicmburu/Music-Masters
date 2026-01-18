// app/blog/[slug]/BlogPostPage.tsx
// ← This is the component you were missing or renamed

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BlogPost {
  title: string
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  content: string
}

export default function BlogPostPage({ post }: { post: BlogPost }) {
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
              <Badge className="bg-coral-500 hover:bg-coral-600 text-white">
                {post.category}
              </Badge>
              <div className="flex items-center gap-2 text-charcoal-400 text-sm">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-charcoal-300 text-sm mb-10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
            </div>

            {post.image && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-12">
                <Image
                  src={post.image}
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
          <div className="max-w-3xl mx-auto prose prose-invert prose-headings:text-charcoal-900 prose-p:text-charcoal-700 prose-li:text-charcoal-700">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Share */}
          <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-charcoal-100">
            <Button variant="outline" className="gap-2">
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
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white placeholder:text-charcoal-500 focus:outline-none focus:border-coral-500"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}