'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: MapPin, title: 'Visit Us', details: ['Westlands, Nairobi', 'Kenya'] },
  { icon: Phone, title: 'Call Us', details: ['+254 712 345 678', '+254 733 456 789'] },
  { icon: Mail, title: 'Email Us', details: ['info@musicalmasters.com', 'bookings@musicalmasters.com'] },
  { icon: Clock, title: 'Working Hours', details: ['Mon - Fri: 8am - 8pm', 'Sat: 9am - 6pm'] },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            Get In <span className="text-coral-500">Touch</span>
          </h1>
          <p className="text-xl text-charcoal-300 max-w-3xl mx-auto">
            Have questions about our lessons? Want to schedule a tour? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-charcoal-900 mb-4">Contact Information</h2>
                <p className="text-charcoal-500">
                  Reach out to us through any of the following channels. We typically respond within 24 hours.
                </p>
              </div>
              
              {contactInfo.map((info) => (
                <Card key={info.title}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-coral-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-charcoal-500 text-sm">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-display text-charcoal-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+254 712 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <Input
                        label="Subject"
                        placeholder="Inquiry about piano lessons"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <Textarea
                      label="Your Message"
                      placeholder="Tell us what you'd like to know..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[150px]"
                    />
                    <Button type="submit" size="lg" className="gap-2" loading={loading}>
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-charcoal-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-charcoal-400 mx-auto mb-4" />
          <p className="text-charcoal-500">Westlands, Nairobi, Kenya</p>
          <p className="text-charcoal-400 text-sm mt-2">Interactive map would be displayed here</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
