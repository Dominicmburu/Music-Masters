'use client'

import Link from 'next/link'
import { Music, Users, Award, Heart, Target, Star } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const values = [
  { icon: Heart, title: 'Passion', description: 'We believe in nurturing a love for music in every student.' },
  { icon: Target, title: 'Excellence', description: 'We strive for the highest standards in music education.' },
  { icon: Users, title: 'Community', description: 'We foster a supportive environment for all musicians.' },
  { icon: Star, title: 'Innovation', description: 'We embrace modern teaching methods and technology.' },
]

const team = [
  { name: 'David Kimani', role: 'Founder & Piano Instructor', bio: '20+ years of experience in classical and jazz piano.' },
  { name: 'Sarah Wanjiku', role: 'Guitar Instructor', bio: 'Specialist in acoustic, electric, and classical guitar.' },
  { name: 'Michael Omondi', role: 'Vocal Coach', bio: 'Professional vocalist with opera and contemporary background.' },
  { name: 'Grace Muthoni', role: 'Violin Instructor', bio: 'Former member of the Kenya National Orchestra.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            About <span className="text-coral-500">Musical Masters</span>
          </h1>
          <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
            Founded with a passion for music education, Musical Masters has been transforming lives 
            through the power of music since 2015.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2 mb-6">
                A Journey of Musical Excellence
              </h2>
              <div className="space-y-4 text-charcoal-600">
                <p>
                  Musical Masters was born from a simple belief: everyone deserves access to quality 
                  music education. What started as a small studio in Westlands has grown into one of 
                  Nairobi's premier music schools.
                </p>
                <p>
                  Our journey began when our founder, a passionate pianist, noticed the gap in 
                  personalized music education in Kenya. He set out to create a space where students 
                  of all ages and skill levels could discover and develop their musical talents.
                </p>
                <p>
                  Today, we've taught over 500 students, hosted countless recitals, and continue to 
                  inspire the next generation of musicians. Our state-of-the-art facilities and 
                  dedicated instructors make learning music an unforgettable experience.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-coral-100 to-coral-200 rounded-3xl flex items-center justify-center">
                <Music className="w-32 h-32 text-coral-500/50" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-charcoal-900 text-white p-6 rounded-2xl">
                <div className="text-4xl font-bold">8+</div>
                <div className="text-charcoal-400">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-coral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-coral-500" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-2">{value.title}</h3>
                  <p className="text-charcoal-500">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
              Meet Our Instructors
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                  <Users className="w-20 h-20 text-charcoal-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-charcoal-900">{member.name}</h3>
                  <p className="text-coral-500 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-charcoal-500 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-900">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-charcoal-400 mb-8 max-w-2xl mx-auto">
            Join our community of passionate musicians and discover your potential.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
