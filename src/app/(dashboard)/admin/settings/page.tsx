'use client'

import { useState, useEffect } from 'react'
import { Settings, Clock, Bell, Mail, Save, Building, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

interface StudioSettings {
  studioName: string
  email: string
  phone: string
  address: string
  openingTime: string
  closingTime: string
  reminderHoursBefore: number
  cancellationPolicy: string
  emailNotifications: boolean
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<StudioSettings>({
    studioName: 'Musical Masters',
    email: 'info@musicalmasters.com',
    phone: '+254 712 345 678',
    address: 'Westlands, Nairobi, Kenya',
    openingTime: '08:00',
    closingTime: '20:00',
    reminderHoursBefore: 1,
    cancellationPolicy: 'Cancellations must be made at least 24 hours before the scheduled lesson.',
    emailNotifications: true,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-charcoal-900">Settings</h1>
        <p className="text-charcoal-500 mt-1">Manage your studio settings and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Studio Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-coral-500" />
              Studio Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Studio Name"
              value={settings.studioName}
              onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <Textarea
              label="Address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-coral-500" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Opening Time"
                type="time"
                value={settings.openingTime}
                onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
              />
              <Input
                label="Closing Time"
                type="time"
                value={settings.closingTime}
                onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-coral-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Reminder Hours Before Lesson"
              type="number"
              min="1"
              max="24"
              value={settings.reminderHoursBefore}
              onChange={(e) => setSettings({ ...settings, reminderHoursBefore: parseInt(e.target.value) || 1 })}
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked === true })}
              />
              <span className="text-sm text-charcoal-700">Send email notifications for bookings and reminders</span>
            </label>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-coral-500" />
              Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              label="Cancellation Policy"
              value={settings.cancellationPolicy}
              onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg" className="gap-2">
            <Save className="w-5 h-5" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
