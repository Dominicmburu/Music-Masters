'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, ShoppingCart } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    name: 'Keyboards & Pianos',
    instruments: [
      { name: 'Yamaha PSR-E373 Keyboard', image: '/images/instruments/Keyboard.jpg', price: 'KSh 30,000', description: '61-key touch-sensitive keyboard with 622 voices and built-in lesson functions — exceptional value for beginners.' },
      { name: 'Digital Piano 88 Keys', image: '/images/instruments/Piano.jpg', price: 'KSh 150,000', description: 'Fully weighted keys, rich piano sound, and premium feel at an unbeatable price point.' },
      { name: 'Kids Electric Piano', image: '/images/instruments/KidsPiano.jpg', price: 'KSh 2,200', description: 'Fun, durable 61-key keyboard perfect for young learners — incredible starter price.' },
    ]
  },
  {
    name: 'Guitars',
    instruments: [
      { name: 'Yamaha C40 Classical Guitar', image: '/images/instruments/Guitar.jpg', price: 'KSh 19,000', description: 'Renowned beginner classical guitar — quality you can trust at a fantastic price.' },
      { name: 'Fender-Style Electric Guitar', image: '/images/instruments/ElectricGuitar.jpg', price: 'KSh 18,000', description: 'Versatile tones and great playability — serious value for electric guitarists.' },
      { name: '6-String Bass Guitar', image: '/images/instruments/BassGuitar.jpg', price: 'KSh 16,000', description: 'Deep, powerful bass sound — professional quality at student-friendly pricing.' },
      { name: 'Soprano Ukulele', image: '/images/instruments/ukulele.jpg', price: 'KSh 3,500', description: 'Bright, portable, and joyful — the perfect entry into strings.' },
    ]
  },
  {
    name: 'Drums & Percussion',
    instruments: [
      { name: 'Yamaha Rydeen 5-Piece Drum Set', image: '/images/instruments/Drumset.jpg', price: 'KSh 180,000', description: 'Complete beginner-friendly acoustic kit — premium brand at a very competitive price.' },
      { name: 'Conga Drums (Pair)', image: '/images/instruments/Conga.jpg', price: 'KSh 95,000', description: 'Handcrafted, rich Latin tones — exceptional quality for the price.' },
      { name: 'Snare Drum with Stand', image: '/images/instruments/Snare.jpg', price: 'KSh 25,000', description: 'Crisp, responsive sound — great value for any setup.' },
    ]
  },
  {
    name: 'String Instruments',
    instruments: [
      { name: 'Stentor Student Violin Outfit', image: '/images/instruments/Violin.jpg', price: 'KSh 40,000', description: 'Complete outfit with bow & case — trusted quality at an excellent price.' },
      { name: 'Student Viola', image: '/images/instruments/Viola.jpg', price: 'KSh 18,000', description: 'Warm, rich tone — perfect start without breaking the bank.' },
    ]
  },
  {
    name: 'Brass Instruments',
    instruments: [
      { name: 'Bb Trumpet (Lacquer Finish)', image: '/images/instruments/Trumpet.jpg', price: 'KSh 22,000', description: 'Smooth valves, bright tone — outstanding value for brass players.' },
      { name: 'Tenor Trombone', image: '/images/instruments/Trombone.jpg', price: 'KSh 28,000', description: 'Reliable slide action — great quality at a student-friendly price.' },
    ]
  },
  {
    name: 'Woodwind Instruments',
    instruments: [
      { name: 'Alto Saxophone', image: '/images/instruments/Saxophone.jpg', price: 'KSh 45,000', description: 'Warm tone, durable build — fantastic deal for aspiring saxophonists.' },
      { name: 'Student Flute', image: '/images/instruments/Flute.jpg', price: 'KSh 8,000', description: 'Silver-plated, easy to play — incredible entry-level pricing.' },
      { name: 'Bb Clarinet', image: '/images/instruments/Clarinet.jpg', price: 'KSh 12,000', description: 'ABS body for durability — superb value for woodwind beginners.' },
    ]
  },
]

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Music Store</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Premium Instruments <span className="text-coral-500">at Great Prices</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-6">
                We carefully select high-quality instruments and price them to give you the best possible value in the Kenyan market.
              </p>
              <p className="text-lg text-charcoal-200 mb-8">
                Exceptional quality. Serious savings. Start playing with confidence today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  Shop Now <ShoppingCart className="w-5 h-5" />
                </Button>
                <Link href="/lessons">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Explore Lessons
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/shop.jpg"
                alt="Beautiful music instruments on display"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instrument Categories */}
      {categories.map((category, index) => (
        <section 
          key={category.name} 
          className={`py-20 ${index % 2 === 0 ? 'bg-charcoal-50' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
                {category.name}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
                {category.name}
              </h2>
              <p className="text-lg text-charcoal-600 mt-4 max-w-3xl mx-auto">
                Premium quality instruments priced to give you the best deal possible.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.instruments.map((instrument) => (
                <Card 
                  key={instrument.name} 
                  className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-coral-200 h-full group"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-56 rounded-t-xl overflow-hidden">
                      <Image 
                        src={instrument.image} 
                        alt={instrument.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-charcoal-900 mb-2 group-hover:text-coral-600 transition-colors">
                        {instrument.name}
                      </h3>
                      <p className="text-charcoal-600 mb-6 flex-grow">
                        {instrument.description}
                      </p>
                      <div className="mt-auto">
                        <div className="text-3xl font-bold text-coral-500 mb-4">
                          {instrument.price}
                        </div>
                        <Button className="w-full gap-2">
                          Add to Cart <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Final Value Emphasis CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Best Value in Kenya for Serious Musicians
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
            We combine premium brands, trusted quality, and pricing that makes learning music more accessible than ever.
          </p>
          <Button size="lg" variant="white" className="text-lg px-10 py-7">
            Start Shopping Now
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}