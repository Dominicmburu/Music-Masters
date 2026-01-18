'use client'

import Link from 'next/link'
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  sitemap: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/shop', label: 'Shop' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  lessons: [
    { href: '/lessons/piano', label: 'Piano Lessons' },
    { href: '/lessons/guitar', label: 'Guitar Lessons' },
    { href: '/lessons/violin', label: 'Violin Lessons' },
    { href: '/lessons/vocals', label: 'Vocal Training' },
    { href: '/lessons/drums', label: 'Drum Lessons' },
  ],
  support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' },
  ],
}

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
]

export function Footer() {
  return (
    <footer className="bg-charcoal-950 text-white">
      {/* Studio Images Strip */}
      <div className="grid grid-cols-5 h-24 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-coral-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">MUSICAL MASTERS</span>
            </Link>
            <p className="text-charcoal-400 text-sm leading-relaxed mb-6">
              Transform your musical journey with expert instruction, premium instruments, 
              and a passionate community dedicated to helping you master your craft.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 rounded-xl flex items-center justify-center hover:bg-coral-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-coral-500 mb-6">
              Sitemap
            </h4>
            <ul className="space-y-3">
              {footerLinks.sitemap.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-coral-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-coral-500 mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral-500 mt-0.5 shrink-0" />
                <span className="text-charcoal-400">
                  Jem Park<br />Sabaki, Mombasa Road<br />Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coral-500 shrink-0" />
                <div className="text-charcoal-400">
                  <a href="tel:+254712345678" className="hover:text-white transition-colors block">
                    +254 784 177 547
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coral-500 shrink-0" />
                <a
                  href="mailto:info@musicalmasters.com"
                  className="text-charcoal-400 hover:text-white transition-colors"
                >
                  info@musicalmasters.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-coral-500 mb-6">
              Subscribe
            </h4>
            <p className="text-charcoal-400 text-sm mb-4">
              Get updates on new courses, workshops, and exclusive offers.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Your email..."
                className="bg-charcoal-800 border-charcoal-700 text-white placeholder:text-charcoal-500 focus:border-coral-500"
              />
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-charcoal-600 bg-charcoal-800 text-coral-500 focus:ring-coral-500"
                />
                <label htmlFor="terms" className="text-xs text-charcoal-400">
                  I have read and agree to the{' '}
                  <Link href="/terms" className="text-coral-500 hover:underline">
                    terms & conditions
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-500 text-sm">
              <span className="text-coral-500">Musical Masters</span> © All Rights Reserved - {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-6 text-sm text-charcoal-500">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
