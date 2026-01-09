'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Clock, Users, BookOpen, Award } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const lessonDetails = {
  beginner: [
    'Basic guitar anatomy and tuning',
    'Fundamental chords and strumming patterns',
    'Proper finger positioning and technique',
    'Reading chord charts and tablature',
    'Simple songs and progressions'
  ],
  intermediate: [
    'Barre chords and advanced chord voicings',
    'Lead guitar techniques and scales',
    'Fingerpicking patterns',
    'Music theory for guitarists',
    'Genre-specific techniques (rock, blues, folk)'
  ],
  advanced: [
    'Advanced improvisation and soloing',
    'Complex fingerstyle arrangements',
    'Music composition on guitar',
    'Studio recording techniques',
    'Performance and stage presence'
  ]
}

const instructorHighlights = [
  'Expert guitarists specializing in multiple genres',
  'Learn acoustic, electric, or classical guitar',
  'Access to professional equipment and amps',
  'Video recordings of your progress',
  'Regular jam sessions and performance opportunities'
]

export default function GuitarLessonsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Instrument Lessons</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Guitar <span className="text-coral-500">Lessons</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-8">
                Learn to play guitar with expert instruction. Master acoustic, electric, or classical guitar 
                with personalized lessons tailored to your musical goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Book Your First Lesson <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/lessons">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    View All Instruments
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/Guitar.jpg"
                alt="Guitar lessons"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-coral-500" />
              </div>
              <div className="text-2xl font-bold text-charcoal-900">60 min</div>
              <div className="text-sm text-charcoal-500">Lesson Duration</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-coral-500" />
              </div>
              <div className="text-2xl font-bold text-charcoal-900">1-on-1</div>
              <div className="text-sm text-charcoal-500">Private Lessons</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-coral-500" />
              </div>
              <div className="text-2xl font-bold text-charcoal-900">All Levels</div>
              <div className="text-sm text-charcoal-500">Beginner to Advanced</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-coral-500" />
              </div>
              <div className="text-2xl font-bold text-charcoal-900">Expert</div>
              <div className="text-sm text-charcoal-500">Certified Instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Levels */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              What You'll Learn
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Level 1</Badge>
                <CardTitle className="text-2xl">Beginner</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lessonDetails.beginner.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="ring-2 ring-coral-500">
              <CardHeader>
                <Badge className="w-fit mb-2">Level 2</Badge>
                <CardTitle className="text-2xl">Intermediate</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lessonDetails.intermediate.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Level 3</Badge>
                <CardTitle className="text-2xl">Advanced</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lessonDetails.advanced.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-charcoal-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Excellence</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
                Why Learn Guitar With Us?
              </h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {instructorHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-coral-500 shrink-0 mt-1" />
                      <span className="text-charcoal-700 text-lg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Investment</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Lesson Pricing
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Private Lessons</CardTitle>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-coral-500">From KES 2,500</span>
                  <span className="text-charcoal-500">/ 60 min</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">One-on-one instruction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">Personalized curriculum</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">Flexible scheduling</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full">Book Private Lesson</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Group Classes</CardTitle>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-coral-500">From KES 1,500</span>
                  <span className="text-charcoal-500">/ 90 min</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">Small groups (3-6 students)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">Collaborative learning</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-charcoal-600">Social experience</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full" variant="outline">Book Group Class</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Ready to Start Your Guitar Journey?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Book your first lesson today and discover the joy of playing guitar with expert guidance.
          </p>
          <Link href="/register">
            <Button size="lg" variant="white">Book Your First Lesson</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}