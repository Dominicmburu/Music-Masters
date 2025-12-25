'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success('Welcome back!')
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-black" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl" />
        
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
              Welcome Back<br />
              <span className="text-coral-500">Musician</span>
            </h1>
            <p className="text-charcoal-400 text-lg max-w-md">
              Continue your musical journey. Access your lessons, track your progress, 
              and connect with our community.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {['🎹', '🎸', '🎻'].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="aspect-square bg-charcoal-800/50 rounded-2xl flex items-center justify-center text-4xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
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
              Sign In
            </h2>
            <p className="text-charcoal-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-coral-500 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.remember}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                />
                <span className="text-sm text-charcoal-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-coral-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-charcoal-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-coral-500 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-coral-500 hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
