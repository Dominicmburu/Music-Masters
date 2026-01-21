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
    'Proper hand position and posture',
    'Basic finger exercises and coordination',
    'Reading treble and bass clef notation',
    'Simple scales (C, G, F major)',
    'Easy classical and popular pieces'
  ],
  intermediate: [
    'Advanced scales and arpeggios (all keys)',
    'Chord progressions and inversions',
    'Pedaling techniques and dynamics',
    'Baroque, Classical, and Romantic repertoire',
    'Sight-reading and accompaniment skills'
  ],
  advanced: [
    'Complex polyphony and counterpoint',
    'Advanced technique (octaves, trills, double thirds)',
    'Concerto and sonata literature',
    'Performance preparation and stage presence',
    'Audition and competition repertoire'
  ]
}

const instructorHighlights = [
  'Experienced pianists with classical and contemporary training',
  'Focus on proper technique from the first lesson',
  'Development of musicality and expression',
  'Regular performance opportunities and recitals',
  'Preparation for exams, competitions, and ensemble playing'
]

export default function PianoLessonsPage() {
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
                Piano <span className="text-coral-500">Lessons</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-8">
                Discover the joy of piano playing with expert guidance. Build strong technique, 
                musical expression, and confidence across classical, jazz, and contemporary styles.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Book Your First Lesson <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/lessons">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    View All Instruments
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/Piano.jpg"
                alt="Piano lessons"
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
                Why Learn Piano With Us?
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

      {/* Pricing – Using your tiered structure from previous instructions */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Investment</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Lesson Pricing (Private – 60 min)
            </h2>
            <p className="text-lg text-charcoal-600 mt-4">
              Tiered according to exam grade level • 20% sibling discount available
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { level: 'Step 1 – Grade 3', price: 'KSh 1,000', sibling: 'KSh 800' },
              { level: 'Grade 4 – Grade 6', price: 'KSh 1,200', sibling: 'KSh 960' },
              { level: 'Grade 7 – Grade 8', price: 'KSh 1,500', sibling: 'KSh 1,200' },
            ].map((tier) => (
              <Card key={tier.level} className="border-2 border-charcoal-200 hover:border-coral-500 transition-colors">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.level}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-coral-500 mb-2">{tier.price}</p>
                  <p className="text-charcoal-600 mb-6">per lesson</p>
                  <div className="bg-charcoal-50 p-4 rounded-lg">
                    <p className="font-semibold mb-1">Sibling Discount (20%)</p>
                    <p className="text-2xl font-bold text-green-600">{tier.sibling}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register">
              <Button size="lg">Enroll & Start Preparing for Your Grade</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Ready to Play with Power & Precision?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join our exam-focused trumpet program and build the skills for ABRSM/LCME success and confident performances.
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