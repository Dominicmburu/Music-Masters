'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-black" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-coral-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-white">MUSICAL MASTERS</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Start Your<br />
              <span className="text-coral-500">Journey</span>
            </h1>
            <p className="text-charcoal-400 text-lg max-w-md">
              Join our community of passionate musicians. Learn from experts, 
              practice in world-class studios, and achieve your musical dreams.
            </p>
          </motion.div>

          <div className="mt-12 space-y-4">
            {[
              '✓ Access to all instruments',
              '✓ Flexible scheduling',
              '✓ Track your progress',
              '✓ Expert instructors',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-charcoal-300"
              >
                <span className="text-coral-500">{feature.slice(0, 1)}</span>
                <span>{feature.slice(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-charcoal-900">MUSICAL MASTERS</span>
          </Link>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold font-display text-charcoal-900 mb-2">
              Create Account
            </h2>
            <p className="text-charcoal-500">
              Already have an account?{' '}
              <Link href="/login" className="text-coral-500 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-12"
                  required
                />
              </div>
              <Input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                type="tel"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 pr-12"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-12"
                required
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                className="mt-0.5"
              />
              <span className="text-sm text-charcoal-600">
                I agree to the{' '}
                <Link href="/terms" className="text-coral-500 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-coral-500 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

        </motion.div>
      </div>
    </div>
  )
}
