'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Music, ArrowRight, Star, Calendar, Award, BookOpen, MapPin } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: '500', label: 'Students Trained', suffix: '+' },
  { value: '6', label: 'Instruments Taught' },
  { value: 'ABRSM & LCME', label: 'Official Pathways' },

]

const mainServices = [
  {
    title: 'Graded Music Lessons',
    description: 'Private one-on-one instruction following official ABRSM and LCME syllabuses from Step/Initial to Grade 8. Expert preparation for exams and quarterly performances.',
    href: '/lessons',
    cta: 'Choose Instrument & Book',
  },
  {
    title: 'Studio Booking & Practice',
    description: 'Access our professional teaching studios for your lessons and additional practice sessions. Book through our simple scheduling system.',
    href: '/register',
    cta: 'Book Your Session',
  },
]

const features = [
  { icon: BookOpen, title: 'ABRSM & LCME Syllabus', description: 'Structured preparation for internationally recognized graded exams' },
  { icon: Calendar, title: 'Quarterly Performances', description: 'Regular student recitals to build confidence and stage experience' },
  { icon: Award, title: 'Certification Pathway', description: 'Clear progression with official certificates from beginner to advanced' },
  { icon: Music, title: 'Premium Instruments', description: 'High-quality instruments provided during lessons' },
  { icon: MapPin, title: 'Convenient Nairobi Location', description: 'Purpose-built facility in a central, accessible area' },
]

const fallbackTestimonials = [
  { id: '1', studentName: 'Aisha Mwangi', content: 'Passed my ABRSM Grade 5 with distinction — the focused syllabus teaching really works!', rating: 5 },
  { id: '2', studentName: 'Ethan Otieno', content: 'From beginner to Grade 4 in under two years. The quarterly performances changed everything.', rating: 5 },
  { id: '3', studentName: 'Zara Khan', content: 'Outstanding LCME vocal coaching. My results were better than expected.', rating: 5 },
  { id: '4', studentName: 'Liam Kamau', content: 'Professional guidance and perfect exam prep — highly recommended.', rating: 5 },
]

const brands = ['YAMAHA', 'STEINWAY', 'FENDER', 'PEARL', 'SHURE', 'SELMER']

// Counter animation component
const CountUp = ({ end, duration = 2.5, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      setCount(Math.min(Math.floor(start), end))
      if (start >= end) clearInterval(timer)
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const fallbackInstruments = [
  { id: '1', name: 'Piano', image: '/images/instruments/Piano.jpg' },
  { id: '2', name: 'Guitar', image: '/images/instruments/Guitar.jpg' },
  { id: '3', name: 'Drums', image: '/images/instruments/Drumset.jpg' },
  { id: '4', name: 'Violin', image: '/images/instruments/Violin.jpg' },
  { id: '5', name: 'Trumpet', image: '/images/instruments/Trumpet.jpg' },
  { id: '6', name: 'Voice', image: '/images/instruments/Vocals.jpg' },
]

export default function HomePage() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [instruments, setInstruments] = useState(fallbackInstruments)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials?.length > 0) {
          setTestimonials(data.testimonials.slice(0, 4))
        }
      })
      .catch(() => {})

    fetch('/api/instruments')
      .then(res => res.json())
      .then(data => {
        if (data.instruments?.length > 0) {
          setInstruments(data.instruments.slice(0, 6))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero Section with floating notes */}
      <section className="relative min-h-screen flex items-center bg-charcoal-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/instruments/class.jpg"
            alt="Musical Masters premium music education environment"
            fill
            className="object-cover object-center brightness-[0.45] contrast-[1.1] scale-105"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950/75 via-charcoal-900/65 to-charcoal-950/75" />
        </div>

        {/* Floating music notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-coral-400/40 text-5xl font-serif font-bold select-none"
              initial={{ y: '120%', opacity: 0 }}
              animate={{
                y: '-120%',
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "linear",
              }}
              style={{ left: `${5 + i * 9}%`, top: '0%' }}
            >
              ♫
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 md:pt-40 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="w-full text-center flex flex-col items-center">
              <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight">
                MUSIC<br />
                <span className="text-coral-500">EXCELLENCE</span>
              </h1>
              <p className="text-lg md:text-xl text-charcoal-200 mb-8 max-w-lg">
                Private lessons • ABRSM & LCME exam preparation • Quarterly performances • Premium quality in Nairobi
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/lessons">
                  <Button size="lg" className="gap-2 bg-coral-500 hover:bg-coral-600 shadow-lg shadow-coral-500/30">
                    Start Your Grade Journey <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Free Consultation
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-12 pt-10 border-t border-white/10 justify-items-center w-full">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-coral-400 mb-1">
                      {stat.value.match(/^\d+$/) ? (
                        <CountUp end={parseInt(stat.value)} suffix={stat.suffix || ''} />
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm md:text-base text-charcoal-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Our Core Offerings</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-charcoal-900 mt-3">
              Focused Music Education
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {mainServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.4 } }}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-coral-300 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="h-48 bg-gradient-to-br from-charcoal-50 to-white flex items-center justify-center">
                    <Music className="w-20 h-20 text-coral-400/30" />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-4">{service.title}</h3>
                    <p className="text-lg text-charcoal-600 mb-6">{service.description}</p>
                    <Link href={service.href}>
                      <Button className="gap-2 w-full md:w-auto">
                        {service.cta} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works */}
<section className="py-20 bg-charcoal-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center mb-16">
      <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
        Your Journey
      </span>
      <h2 className="text-4xl md:text-5xl font-bold font-display text-charcoal-900 mt-3">
        How It Works
      </h2>
    </div>

    <div className="grid md:grid-cols-4 gap-8">
      {[
        {
          step: '1',
          title: 'Free Consultation',
          description: 'Discuss your goals, experience level and preferred instrument.',
        },
        {
          step: '2',
          title: 'Placement & Plan',
          description: 'We assess your current level and create a personalized syllabus plan.',
        },
        {
          step: '3',
          title: 'Regular Lessons',
          description: 'Weekly private lessons with clear goals and progress tracking.',
        },
        {
          step: '4',
          title: 'Exams & Performances',
          description: 'Prepare for graded exams and showcase your skills in quarterly recitals.',
        },
      ].map((item, i) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="relative text-center"
        >
          {i < 3 && (
            <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-charcoal-200 -translate-x-1/2" />
          )}
          <div className="w-16 h-16 mx-auto mb-6 bg-coral-500 text-white rounded-full flex items-center justify-center text-2xl font-bold relative z-10">
            {item.step}
          </div>
          <h3 className="text-xl font-bold text-charcoal-900 mb-3">{item.title}</h3>
          <p className="text-charcoal-600">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <Card className="border-none shadow-lg hover:shadow-2xl transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-coral-100 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-coral-600" />
                    </div>
                    <h4 className="text-xl font-bold text-charcoal-900 mb-3">{feature.title}</h4>
                    <p className="text-charcoal-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Instruments Overview */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center mb-12">
      <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
        Instruments
      </span>
      <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-3">
        What We Teach
      </h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {instruments.map((instrument) => (
        <Link key={instrument.id} href={`/lessons/${instrument.name.toLowerCase()}`}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-charcoal-100">
              {instrument.image ? (
                <Image
                  src={instrument.image}
                  alt={instrument.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🎵
                </div>
              )}
            </div>
            <p className="text-center font-medium text-charcoal-900 group-hover:text-coral-600 transition-colors">
              {instrument.name}
            </p>
          </motion.div>
        </Link>
      ))}
    </div>

    <div className="text-center mt-10">
      <Link href="/lessons">
        <Button variant="outline" className="gap-2">
          View All Lessons <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">Student Success Stories</span>
            <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-3">Real Results</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array(t.rating).fill(0).map((_, idx) => (
                        <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-charcoal-700 mb-6 italic">"{t.content}"</p>
                    <p className="font-bold text-charcoal-900">{t.studentName}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-coral-600">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-white/90 text-sm uppercase tracking-wider mb-6">
            Featured Instruments & Equipment
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-90">
            {brands.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-white font-bold font-display text-xl md:text-2xl tracking-wider"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
<section className="py-20 bg-charcoal-50">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="text-center mb-12">
      <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
        Frequently Asked
      </span>
      <h2 className="text-4xl font-bold font-display text-charcoal-900 mt-3">
        Common Questions
      </h2>
    </div>

    <div className="max-w-3xl mx-auto space-y-6">
      {[
        {
          q: 'Do I need prior experience to start lessons?',
          a: 'No – we welcome complete beginners. Our teachers will start at your current level and guide you step by step.',
        },
        {
          q: 'How long are the lessons and how often?',
          a: 'Most private lessons are 60 minutes and take place once a week. Other arrangements can be discussed during the consultation.',
        },
        {
          q: 'When are the next performance opportunities?',
          a: 'We organize student recitals every quarter. Exam candidates also get support for ABRSM or LCME performance components.',
        },
        {
          q: 'Are exams mandatory?',
          a: 'No – many students take lessons purely for enjoyment. However, our structured approach makes graded exams a natural next step for those who wish to pursue them.',
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-xl font-bold text-charcoal-900 mb-3">{item.q}</h3>
          <p className="text-charcoal-600">{item.a}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Final CTA with pulse */}
      <section className="py-24 bg-gradient-to-b from-charcoal-950 to-black">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold font-display text-white mb-6"
          >
            Ready to Achieve Your Next Music Grade?
          </motion.h2>
          <p className="text-xl text-charcoal-300 mb-10 max-w-2xl mx-auto">
            Join successful students in Nairobi mastering ABRSM & LCME exams with expert private instruction.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <Link href="/lessons">
                <Button size="lg" className="bg-coral-500 hover:bg-coral-600 px-12 py-7 text-lg shadow-lg shadow-coral-500/40">
                  Start Your Grade Journey Today
                </Button>
              </Link>
            </motion.div>

            <Link href="/register">
              <Button size="lg" variant="outline" className="border-coral-400 text-coral-400 hover:bg-coral-500/10 px-12 py-7 text-lg">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}