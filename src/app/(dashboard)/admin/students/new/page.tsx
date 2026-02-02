'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Lock, Send, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

export default function NewStudentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [sendCredentials, setSendCredentials] = useState(true)
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true)

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!autoGeneratePassword && !formData.password) {
      toast.error('Please enter a password or enable auto-generate')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          password: autoGeneratePassword ? undefined : formData.password,
          sendCredentials,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(
          sendCredentials
            ? 'Student created and credentials sent via email!'
            : 'Student created successfully!'
        )

        if (!sendCredentials && data.temporaryPassword) {
          toast(
            `Temporary password: ${data.temporaryPassword}`,
            { duration: 10000, icon: '🔑' }
          )
        }

        router.push('/admin/students')
      } else {
        toast.error(data.error || 'Failed to create student')
      }
    } catch (error) {
      toast.error('Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Add New Student</h1>
          <p className="text-charcoal-600 mt-1">Create a new student account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-coral-500" />
            Student Information
          </CardTitle>
          <CardDescription>
            Enter the student's details. They will receive login credentials via email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 712 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-charcoal-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="autoGenerate"
                  checked={autoGeneratePassword}
                  onCheckedChange={(checked) => {
                    setAutoGeneratePassword(checked as boolean)
                    if (checked) {
                      setFormData({ ...formData, password: '' })
                    }
                  }}
                />
                <Label htmlFor="autoGenerate" className="font-normal">
                  Auto-generate password
                </Label>
              </div>

              {!autoGeneratePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                      <Input
                        id="password"
                        type="text"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-coral-50 border border-coral-200 rounded-lg">
              <Checkbox
                id="sendCredentials"
                checked={sendCredentials}
                onCheckedChange={(checked) => setSendCredentials(checked as boolean)}
              />
              <div>
                <Label htmlFor="sendCredentials" className="font-medium">
                  Send login credentials via email
                </Label>
                <p className="text-sm text-charcoal-600 mt-1">
                  The student will receive an email with their login details and a link to access their dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/admin/students">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Create Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
