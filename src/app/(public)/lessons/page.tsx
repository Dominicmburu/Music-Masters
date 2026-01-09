'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Music, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const instruments = [
  { name: 'Piano', image: '/images/instruments/Piano.jpg', description: 'Classical, jazz, and contemporary piano instruction', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Keyboard', image: '/images/instruments/Keyboard.jpg', description: 'Electronic keyboard and synthesizer training', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Guitar', image: '/images/instruments/Guitar.jpg', description: 'Acoustic, electric, and classical guitar lessons', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Violin', image: '/images/instruments/Violin.jpg', description: 'Classical violin and fiddle training', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Drumset', image: '/images/instruments/Drumset.jpg', description: 'Drum kit and percussion lessons', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Vocals', image: '/images/instruments/Vocals.jpg', description: 'Voice training and singing lessons', levels: ['Beginner', 'Intermediate', 'Advanced'] },
  { name: 'Saxophone', image: '/images/instruments/Saxophone.jpg', description: 'Jazz and classical saxophone instruction', levels: ['Beginner', 'Intermediate', 'Advanced'] },
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

     {/* Hero - Now matches individual instrument pages style */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Music Lessons</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Music <span className="text-coral-500">Lessons</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-8">
                Expert instruction for all ages and skill levels. From piano and guitar to vocals, 
                drums, violin and more — start your musical journey with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Book Your First Lesson <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/lessons.jpg"  // ← your saved image
                alt="Music lessons - various instruments"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instruments.map((instrument) => (
              <Link key={instrument.name} href={`/lessons/${instrument.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform mx-auto sm:mx-0">
                      <Image 
                        src={instrument.image} 
                        alt={instrument.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-bold text-charcoal-900 mb-2">{instrument.name}</h3>
                      <p className="text-charcoal-500 text-sm mb-3">{instrument.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {instrument.levels.map((level) => (
                          <Badge key={level} variant="secondary" className="text-xs">{level}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
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