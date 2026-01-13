'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Music, ArrowRight, Star, Calendar, Award, Headphones, MapPin } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: '500+', label: 'Students Taught' },
  { value: '15+', label: 'Expert Instructors' },
  { value: '6', label: 'Instruments' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const services = [
  { title: 'Private Lessons', description: 'One-on-one instruction tailored to your skill level and learning pace.', href: '/lessons', cta: 'Book Now' },
  { title: 'Group Classes', description: 'Learn alongside fellow musicians in engaging group sessions.', href: '/lessons', cta: 'Join Class' },
]

const features = [
  { icon: Music, title: 'Live Instruments', description: 'Premium pianos, guitars, drums, and more.' },
  { icon: MapPin, title: 'Multiple Studios', description: 'Dedicated rooms with optimal acoustics.' },
  { icon: Headphones, title: 'Professional Equipment', description: 'Industry-standard recording equipment.' },
  { icon: Award, title: 'Custom Curriculum', description: 'Personalized lesson plans for your goals.' },
  { icon: Star, title: 'Sound Quality', description: 'Acoustically treated rooms.' },
  { icon: Calendar, title: 'Certification', description: 'Earn recognized certificates.' },
]

const practiceRooms = [
  { id: 1, name: 'Piano Studio', price: 2500, description: 'Steinway grand piano, optimal acoustics' },
  { id: 2, name: 'Guitar Room', price: 2000, description: 'Multiple acoustic and electric guitars' },
  { id: 3, name: 'Vocal Booth', price: 1800, description: 'Soundproofed recording-ready space' },
  { id: 4, name: 'Drum Room', price: 2200, description: 'Professional drum kit with isolation' },
  { id: 5, name: 'Recording Suite', price: 3500, description: 'Full recording setup with engineer' },
]

const testimonials = [
  { name: 'Lisa Martinez', role: 'Piano', content: 'Musical Masters transformed my piano skills!' },
  { name: 'James Wilson', role: 'Guitar', content: 'Amazing progress in just 6 months!' },
  { name: 'Sarah Chen', role: 'Vocals', content: 'World-class vocal coaching here.' },
  { name: 'David Kim', role: 'Violin', content: 'Professional environment and passionate teachers.' },
]

const brands = ['YAMAHA', 'FENDER', 'STEINWAY', 'SHURE', 'SENNHEISER', 'PEARL']

export default function HomePage() {
  const [activeRoom, setActiveRoom] = useState(0)

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-charcoal-950">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight">
                MUSIC<br /><span className="text-coral-500">EDUCATION</span>
              </h1>
              <p className="text-lg text-charcoal-300 mb-8 max-w-lg">
                Transform your musical journey with expert instruction, premium instruments, 
                and a passionate community dedicated to helping you master your craft.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <Button size="lg" className="gap-2">Book a Lesson <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">Learn More</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-charcoal-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-3xl flex items-center justify-center">
               <img src="/images/instruments/class.jpg" alt="" />
                {/* <Music className="w-32 h-32 text-coral-500/50" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">What We Do</span>
            <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-2">STUDIO SERVICES</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                  <Music className="w-16 h-16 text-charcoal-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-charcoal-900 mb-2">{service.title}</h3>
                  <p className="text-charcoal-500 mb-4">{service.description}</p>
                  <Link href={service.href}><Button className="gap-2">{service.cta} <ArrowRight className="w-4 h-4" /></Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-2">OUR FEATURES</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-coral-500" />
                  </div>
                  <h4 className="text-lg font-bold text-charcoal-900 mb-2">{feature.title}</h4>
                  <p className="text-charcoal-500 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Rooms Section */}
      <section className="py-20 bg-charcoal-950 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Territory</span>
            <h2 className="text-4xl font-bold font-display mt-2">PRACTICE ROOMS</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              {practiceRooms.map((room, index) => (
                <button key={room.id} onClick={() => setActiveRoom(index)} 
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all ${activeRoom === index ? 'bg-coral-500 text-white' : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'}`}>
                  <span className="opacity-70">0{index + 1}.</span> <span className="font-semibold uppercase">{room.name}</span>
                </button>
              ))}
            </div>
            <div className="bg-charcoal-800 rounded-2xl p-6">
              <div className="aspect-video bg-charcoal-700 rounded-xl mb-4 flex items-center justify-center">
                <Music className="w-16 h-16 text-charcoal-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">{practiceRooms[activeRoom].name}</h3>
              <p className="text-charcoal-400 mb-4">{practiceRooms[activeRoom].description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">{practiceRooms[activeRoom].price.toLocaleString()}</span>
                  <span className="text-coral-500 text-sm"> KES</span>
                  <span className="text-charcoal-400">/hour</span>
                </div>
                <Link href="/login"><Button>Book Room</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-2">WHAT STUDENTS SAY</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-charcoal-600 mb-4">"{t.content}"</p>
                  <p className="font-semibold text-charcoal-900">{t.name}</p>
                  <p className="text-sm text-charcoal-500">{t.role} Student</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-10 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {brands.map((brand) => (
              <div key={brand} className="text-white/80 font-bold font-display">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-display text-white mb-6">Ready to Start Your Musical Journey?</h2>
          <p className="text-charcoal-400 mb-8 max-w-2xl mx-auto">Join hundreds of students who have transformed their musical abilities.</p>
          <Link href="/register"><Button size="lg" className="gap-2">Get Started Today <ArrowRight className="w-5 h-5" /></Button></Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
