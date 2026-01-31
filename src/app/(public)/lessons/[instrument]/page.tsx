'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, Users, BookOpen, Award, Loader2, Music } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Instrument {
  id: string
  name: string
  description: string | null
  icon: string | null
}

interface Lesson {
  id: string
  title: string
  description: string | null
  duration: number
  price: number
  lessonType: 'PRIVATE' | 'GROUP'
  maxStudents: number
}

const defaultLessonDetails = {
  beginner: [
    'Proper posture and technique fundamentals',
    'Basic exercises and coordination',
    'Reading musical notation',
    'Simple scales and patterns',
    'Easy pieces for beginners'
  ],
  intermediate: [
    'Advanced scales and techniques',
    'Complex rhythms and patterns',
    'Repertoire development',
    'Sight-reading skills',
    'Performance preparation'
  ],
  advanced: [
    'Professional technique refinement',
    'Advanced repertoire and interpretation',
    'Competition and audition preparation',
    'Stage presence and performance skills',
    'Masterclass opportunities'
  ]
}

const instructorHighlights = [
  'Experienced instructors with professional training',
  'Focus on proper technique from the first lesson',
  'Development of musicality and expression',
  'Regular performance opportunities and recitals',
  'Preparation for ABRSM/LCME exams and competitions'
]

const pricingTiers = [
  { level: 'Step 1 – Grade 3', price: 'KSh 1,000', sibling: 'KSh 800' },
  { level: 'Grade 4 – Grade 6', price: 'KSh 1,200', sibling: 'KSh 960' },
  { level: 'Grade 7 – Grade 8', price: 'KSh 1,500', sibling: 'KSh 1,200' },
]

export default function InstrumentLessonsPage() {
  const params = useParams()
  const instrumentSlug = params.instrument as string

  const [instrument, setInstrument] = useState<Instrument | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all instruments and find the matching one
        const instrumentRes = await fetch('/api/instruments')
        const instrumentData = await instrumentRes.json()

        if (instrumentData.instruments) {
          const found = instrumentData.instruments.find(
            (i: Instrument) => i.name.toLowerCase() === instrumentSlug.toLowerCase()
          )

          if (found) {
            setInstrument(found)

            // Fetch lessons for this instrument
            const lessonsRes = await fetch(`/api/lessons?instrumentId=${found.id}`)
            const lessonsData = await lessonsRes.json()
            if (lessonsData.lessons) {
              setLessons(lessonsData.lessons)
            }
          } else {
            setNotFoundState(true)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [instrumentSlug])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
        </div>
        <Footer />
      </main>
    )
  }

  if (notFoundState || !instrument) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Music className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-charcoal-900 mb-4">Instrument Not Found</h1>
            <p className="text-charcoal-600 mb-8">We couldn't find lessons for this instrument.</p>
            <Link href="/lessons">
              <Button>View All Instruments</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
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
              <Badge className="mb-4">Instrument Lessons</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                {instrument.name} <span className="text-coral-500">Lessons</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-8">
                {instrument.description || `Discover the joy of ${instrument.name.toLowerCase()} playing with expert guidance. Build strong technique, musical expression, and confidence with our structured ABRSM & LCME exam preparation.`}
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
            <div className="relative h-[400px] rounded-2xl overflow-hidden bg-charcoal-800 flex items-center justify-center">
              {instrument.icon ? (
                <span className="text-9xl">{instrument.icon}</span>
              ) : (
                <Music className="w-32 h-32 text-coral-500/50" />
              )}
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

      {/* Available Lessons from DB */}
      {lessons.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Available Classes</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
                {instrument.name} Lesson Options
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="border-2 border-charcoal-200 hover:border-coral-500 transition-colors">
                  <CardHeader>
                    <Badge className="w-fit mb-2" variant={lesson.lessonType === 'PRIVATE' ? 'default' : 'secondary'}>
                      {lesson.lessonType === 'PRIVATE' ? 'Private' : 'Group'}
                    </Badge>
                    <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.description && (
                      <p className="text-charcoal-600 mb-4">{lesson.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-charcoal-500 mb-4">
                      <span>{lesson.duration} minutes</span>
                      {lesson.lessonType === 'GROUP' && (
                        <span>Max {lesson.maxStudents} students</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-coral-500">
                      KSh {lesson.price.toLocaleString()}
                      <span className="text-sm font-normal text-charcoal-500"> /lesson</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
                  {defaultLessonDetails.beginner.map((item) => (
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
                  {defaultLessonDetails.intermediate.map((item) => (
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
                  {defaultLessonDetails.advanced.map((item) => (
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
                Why Learn {instrument.name} With Us?
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
              Lesson Pricing (Private – 60 min)
            </h2>
            <p className="text-lg text-charcoal-600 mt-4">
              Tiered according to exam grade level • 20% sibling discount available
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
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
            Ready to Start Your {instrument.name} Journey?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join our exam-focused program and build the skills for ABRSM/LCME success and confident performances.
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
