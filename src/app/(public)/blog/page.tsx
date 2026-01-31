'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Calendar, Loader2, FileText } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  publishedAt: string | null
  createdAt: string
  category: { id: string; name: string; slug: string } | null
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    fetchPosts(1, true)
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories')
      const data = await res.json()
      if (data.categories) setCategories(data.categories)
    } catch (error) {
      console.error('Failed to load categories')
    }
  }

  const fetchPosts = async (pageNum: number, reset: boolean = false) => {
    if (reset) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '9',
      })
      if (selectedCategory !== 'ALL') {
        params.append('categoryId', selectedCategory)
      }

      const res = await fetch(`/api/blog/posts?${params}`)
      const data = await res.json()

      if (data.posts) {
        if (reset) {
          setPosts(data.posts)
        } else {
          setPosts(prev => [...prev, ...data.posts])
        }
        setHasMore(data.pagination?.hasMore || false)
      }
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }, [loadingMore, hasMore, page])

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, loading, loadMore])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    setSubscribing(true)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        toast.success('Subscribed successfully!')
        setEmail('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      toast.error('Failed to subscribe')
    } finally {
      setSubscribing(false)
    }
  }

  // Calculate reading time from content
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Musical Masters Blog</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Music <span className="text-coral-500">Insights</span> & Tips
              </h1>
              <p className="text-xl text-charcoal-300 mb-8">
                Practical advice, expert tutorials, and inspiration from our instructors to help you grow as a musician.
              </p>
              <Link href="#posts">
                <Button size="lg" className="gap-2">
                  Explore Articles <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/blog.jpg"
                alt="Musical inspiration and learning"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section id="posts" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-coral-500 text-white shadow-md'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-coral-500 text-white shadow-md'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {category.name} ({category._count.posts})
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              <span className="ml-2 text-charcoal-600">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-charcoal-900 mb-2">No posts yet</h2>
              <p className="text-charcoal-600">Check back soon for new articles!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 group border border-charcoal-100">
                      <div className="relative h-48 overflow-hidden bg-charcoal-100">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileText className="w-12 h-12 text-charcoal-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {post.category && (
                            <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200">
                              {post.category.name}
                            </Badge>
                          )}
                          <span className="text-sm text-charcoal-500 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {getReadTime(post.content)}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-charcoal-900 mb-3 group-hover:text-coral-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-charcoal-600 text-sm mb-6 line-clamp-3">
                          {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                        </p>

                        <div className="flex items-center text-sm text-charcoal-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(post.publishedAt || post.createdAt, 'MMM d, yyyy')}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-coral-500" />
                    <span className="text-charcoal-600">Loading more...</span>
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-charcoal-500">You've reached the end</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-charcoal-900">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Stay in Tune
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-xl mx-auto">
            Subscribe for new articles, exclusive tips, and updates from Musical Masters.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 h-14 rounded-xl bg-charcoal-800 border-charcoal-700 text-white placeholder:text-charcoal-500"
            />
            <Button type="submit" size="lg" className="min-w-[160px]" disabled={subscribing}>
              {subscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
