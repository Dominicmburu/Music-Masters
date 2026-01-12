'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Music, Clock, Users, ArrowRight, CheckCircle, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const instruments = [
  { 
    name: 'Piano', 
    image: '/images/instruments/Piano.jpg', 
    description: 'Comprehensive preparation for ABRSM & LCME exams — from Step/Initial to Grade 8' 
  },
  { 
    name: 'Guitar', 
    image: '/images/instruments/Guitar.jpg', 
    description: 'Acoustic, electric & bass guitar lessons following ABRSM & LCME syllabuses' 
  },
  { 
    name: 'Drums', 
    image: '/images/instruments/Drumset.jpg', 
    description: 'Drum kit training with focus on graded exams (ABRSM & LCME)' 
  },
  { 
    name: 'Violin', 
    image: '/images/instruments/Violin.jpg', 
    description: 'Classical violin instruction aligned with ABRSM & LCME requirements' 
  },
  { 
    name: 'Trumpet', 
    image: '/images/instruments/Trumpet.jpg', // ← add this image if available
    description: 'Brass training for ABRSM & LCME graded exams and performances' 
  },
  { 
    name: 'Saxophone', 
    image: '/images/instruments/Saxophone.jpg', 
    description: 'Jazz & classical saxophone preparation for ABRSM & LCME certifications' 
  },
  { 
    name: 'Voice', 
    image: '/images/instruments/Vocals.jpg', 
    description: 'Singing & vocal technique — ABRSM & LCME syllabus for all levels' 
  },
]

const pricingTiers = [
  {
    level: 'Step 1 – Grade 3',
    price: 'KSh 1,000',
    siblingPrice: 'KSh 800',
  },
  {
    level: 'Grade 4 – Grade 6',
    price: 'KSh 1,200',
    siblingPrice: 'KSh 960',
  },
  {
    level: 'Grade 7 – Grade 8',
    price: 'KSh 1,500',
    siblingPrice: 'KSh 1,200',
  },
]

export default function LessonsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero - Exam & Performance Focused */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Exam-Focused Music Lessons</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Graded Music <span className="text-coral-500">Lessons</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-6">
                Expert, structured instruction designed for ABRSM and LCME graded exams (from Step/Initial to Grade 8) and quarterly performances.
              </p>
              <p className="text-lg text-charcoal-300 mb-8">
                Our primary goal is to prepare students confidently for internationally recognized certifications and live performances.
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
                src="/images/instruments/lessons.jpg"
                alt="Students preparing for music exams with instruments"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instruments Offered */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Instruments</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Instruments We Teach
            </h2>
            <p className="text-lg text-charcoal-600 mt-4 max-w-3xl mx-auto">
              All lessons follow the official ABRSM and LCME syllabuses, ensuring structured progression toward graded exams and performance excellence.
            </p>
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
                        <p className="text-charcoal-600 text-sm mb-3">{instrument.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Payment Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Private Lesson Fees
            </h2>
            <p className="text-lg text-charcoal-600 mt-4 max-w-3xl mx-auto">
              Our tiered pricing reflects the increasing technical and musical demands of higher grades. All lessons are 60 minutes and focused on exam & performance preparation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {pricingTiers.map((tier) => (
              <Card key={tier.level} className="relative overflow-hidden border-2 border-charcoal-200 hover:border-coral-500 transition-colors">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{tier.level}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-coral-500">{tier.price}</p>
                    <p className="text-charcoal-500">per lesson</p>
                  </div>
                  <div className="bg-charcoal-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-charcoal-900 mb-2">Sibling Discount (20%)</p>
                    <p className="text-2xl font-bold text-green-600">{tier.siblingPrice}</p>
                    <p className="text-sm text-charcoal-600">per sibling</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-charcoal-50 p-8 rounded-2xl border border-charcoal-200">
            <h3 className="text-2xl font-bold text-charcoal-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-coral-500" /> Important Payment Information
            </h3>
            <p className="text-charcoal-700 mb-4">
              To ensure consistent scheduling and proper planning of lesson sessions each month, fees should be paid in full at the <strong>beginning of each month</strong>.
            </p>
            <p className="text-charcoal-700">
              This upfront system allows us to maintain high-quality preparation for your upcoming exams and quarterly performance opportunities.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Enroll Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Updated for exam focus */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Your Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              How We Prepare You for Success
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Enroll', desc: 'Sign up and choose your instrument' },
              { step: '02', title: 'Assess', desc: 'Initial level assessment & syllabus selection' },
              { step: '03', title: 'Train', desc: 'Structured lessons following ABRSM/LCME syllabus' },
              { step: '04', title: 'Perform', desc: 'Quarterly performances & graded exams' },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-charcoal-200" />
                )}
                <div className="w-16 h-16 bg-coral-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">{item.title}</h3>
                <p className="text-charcoal-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Ready to Achieve Your Grades?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Start your journey toward ABRSM or LCME certification with expert guidance and quarterly performance opportunities.
          </p>
          <Link href="/register">
            <Button size="lg" variant="white">Get Started Today</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}