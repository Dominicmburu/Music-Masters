'use client'

import Link from 'next/link'
import { Music, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const instruments = [
  { name: 'Piano', emoji: '🎹', description: 'Classical, jazz, and contemporary piano instruction', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Guitar', emoji: '🎸', description: 'Acoustic, electric, and classical guitar lessons', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Violin', emoji: '🎻', description: 'Classical violin and fiddle training', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Drums', emoji: '🥁', description: 'Drum kit and percussion lessons', levels: ['Beginner', 'Intermediate'] },
  { name: 'Vocals', emoji: '🎤', description: 'Voice training and singing lessons', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Saxophone', emoji: '🎷', description: 'Jazz and classical saxophone instruction', levels: ['Beginner', 'Intermediate'] },
]

const lessonTypes = [
  {
    type: 'Private Lessons',
    price: 'From KES 2,500',
    duration: '60 min',
    features: ['One-on-one instruction', 'Personalized curriculum', 'Flexible scheduling', 'Progress tracking', 'Recording of sessions'],
    popular: true,
  },
  {
    type: 'Group Classes',
    price: 'From KES 1,500',
    duration: '90 min',
    features: ['Small groups (3-6 students)', 'Collaborative learning', 'Peer motivation', 'Ensemble practice', 'Social experience'],
    popular: false,
  },
]

export default function LessonsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            Music <span className="text-coral-500">Lessons</span>
          </h1>
          <p className="text-xl text-charcoal-300 max-w-3xl mx-auto mb-8">
            Discover your musical potential with our expert instructors. We offer lessons for 
            all skill levels across a variety of instruments.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Book Your First Lesson <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Lesson Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Choose Your Style</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Lesson Types
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {lessonTypes.map((lesson) => (
              <Card key={lesson.type} className={`relative overflow-hidden ${lesson.popular ? 'ring-2 ring-coral-500' : ''}`}>
                {lesson.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{lesson.type}</CardTitle>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-coral-500">{lesson.price}</span>
                    <span className="text-charcoal-500">/ {lesson.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lesson.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-charcoal-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full mt-6" variant={lesson.popular ? 'default' : 'outline'}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Instruments</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              What Would You Like to Learn?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instruments.map((instrument) => (
              <Card key={instrument.name} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-coral-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {instrument.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-charcoal-900 mb-1">{instrument.name}</h3>
                      <p className="text-charcoal-500 text-sm mb-3">{instrument.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {instrument.levels.map((level) => (
                          <Badge key={level} variant="secondary" className="text-xs">{level}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your free account' },
              { step: '02', title: 'Choose', desc: 'Select your instrument and lesson type' },
              { step: '03', title: 'Book', desc: 'Pick a convenient time slot' },
              { step: '04', title: 'Learn', desc: 'Start your musical journey!' },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-charcoal-200" />
                )}
                <div className="w-16 h-16 bg-coral-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">{item.title}</h3>
                <p className="text-charcoal-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Book your first lesson today and discover the joy of making music.
          </p>
          <Link href="/register">
            <Button size="lg" variant="white">Get Started Free</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
