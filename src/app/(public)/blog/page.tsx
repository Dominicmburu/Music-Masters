'use client'

import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const blogPosts = [
  {
    id: 1,
    title: '10 Tips for Beginner Piano Players',
    excerpt: 'Starting your piano journey? Here are essential tips to help you build a strong foundation and develop good habits from day one.',
    category: 'Piano',
    author: 'David Kimani',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'How to Choose Your First Guitar',
    excerpt: 'Acoustic or electric? Nylon or steel strings? We break down everything you need to know when selecting your first guitar.',
    category: 'Guitar',
    author: 'Sarah Wanjiku',
    date: 'Dec 10, 2024',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'The Benefits of Music Education for Children',
    excerpt: 'Research shows that learning music at a young age has profound effects on cognitive development, social skills, and emotional well-being.',
    category: 'Education',
    author: 'Grace Muthoni',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Mastering Vocal Warm-ups: A Complete Guide',
    excerpt: 'Proper warm-ups are essential for vocal health and performance. Learn the techniques used by professional singers.',
    category: 'Vocals',
    author: 'Michael Omondi',
    date: 'Nov 28, 2024',
    readTime: '8 min read',
  },
  {
    id: 5,
    title: 'Understanding Music Theory: Where to Start',
    excerpt: 'Music theory can seem daunting, but it doesn\'t have to be. Here\'s a beginner-friendly introduction to the basics.',
    category: 'Theory',
    author: 'David Kimani',
    date: 'Nov 20, 2024',
    readTime: '10 min read',
  },
  {
    id: 6,
    title: 'Practice Strategies That Actually Work',
    excerpt: 'Quality over quantity: discover science-backed practice techniques that will accelerate your musical progress.',
    category: 'Tips',
    author: 'Sarah Wanjiku',
    date: 'Nov 15, 2024',
    readTime: '6 min read',
  },
]

const categories = ['All', 'Piano', 'Guitar', 'Vocals', 'Education', 'Theory', 'Tips']

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            Our <span className="text-coral-500">Blog</span>
          </h1>
          <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
            Tips, tutorials, and insights from our expert instructors to help you on your musical journey.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All' 
                    ? 'bg-coral-500 text-white' 
                    : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                  <span className="text-6xl opacity-50">📝</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-charcoal-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-2 group-hover:text-coral-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-charcoal-500 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
                    <div className="flex items-center gap-2 text-sm text-charcoal-500">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal-500">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-charcoal-900">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-charcoal-400 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for the latest tips, tutorials, and updates from Musical Masters.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white placeholder:text-charcoal-500 focus:outline-none focus:border-coral-500"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
