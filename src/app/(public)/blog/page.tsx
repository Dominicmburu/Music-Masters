'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, User, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const blogPosts = [
  {
    id: 1,
    slug: '10-tips-for-beginner-piano-players',
    title: '10 Tips for Beginner Piano Players',
    excerpt: 'Starting your piano journey? Here are essential tips to help you build a strong foundation and develop good habits from day one.',
    category: 'Piano',
    author: 'David Kimani',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    image: '/images/instruments/piano-beginner.jpg' // ← add your real images later
  },
  {
    id: 2,
    slug: 'how-to-choose-your-first-guitar',
    title: 'How to Choose Your First Guitar',
    excerpt: 'Acoustic or electric? Nylon or steel strings? We break down everything you need to know when selecting your first guitar.',
    category: 'Guitar',
    author: 'Sarah Wanjiku',
    date: 'Dec 10, 2024',
    readTime: '7 min read',
    image: '/images/instruments/guitar-choose.jpg'
  },
  {
    id: 3,
    slug: 'benefits-of-music-education-for-children',
    title: 'The Benefits of Music Education for Children',
    excerpt: 'Research shows that learning music at a young age has profound effects on cognitive development, social skills, and emotional well-being.',
    category: 'Education',
    author: 'Grace Muthoni',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    image: '/images/instruments/kids-music.jpg'
  },
  {
    id: 4,
    slug: 'mastering-vocal-warm-ups-guide',
    title: 'Mastering Vocal Warm-ups: A Complete Guide',
    excerpt: 'Proper warm-ups are essential for vocal health and performance. Learn the techniques used by professional singers.',
    category: 'Vocals',
    author: 'Michael Omondi',
    date: 'Nov 28, 2024',
    readTime: '8 min read',
    image: '/images/instruments/vocal-warmup.jpg'
  },
  {
    id: 5,
    slug: 'understanding-music-theory-where-to-start',
    title: 'Understanding Music Theory: Where to Start',
    excerpt: 'Music theory can seem daunting, but it doesn\'t have to be. Here\'s a beginner-friendly introduction to the basics.',
    category: 'Theory',
    author: 'David Kimani',
    date: 'Nov 20, 2024',
    readTime: '10 min read',
    image: '/images/instruments/music-theory.jpg'
  },
  {
    id: 6,
    slug: 'practice-strategies-that-actually-work',
    title: 'Practice Strategies That Actually Work',
    excerpt: 'Quality over quantity: discover science-backed practice techniques that will accelerate your musical progress.',
    category: 'Tips',
    author: 'Sarah Wanjiku',
    date: 'Nov 15, 2024',
    readTime: '6 min read',
    image: '/images/instruments/practice-tips.jpg'
  },
]

const categories = ['All', 'Piano', 'Guitar', 'Vocals', 'Education', 'Theory', 'Tips']

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero - matching instrument pages style */}
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
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === 'All'
                    ? 'bg-coral-500 text-white shadow-md'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 group border border-charcoal-100">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || '/images/blog/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-coral-100 text-coral-700 hover:bg-coral-200">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-charcoal-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-charcoal-900 mb-3 group-hover:text-coral-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-charcoal-600 text-sm mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-charcoal-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Load More Articles
            </Button>
          </div>
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
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white placeholder:text-charcoal-500 focus:outline-none focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20"
            />
            <Button type="submit" size="lg" className="min-w-[160px]">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}  