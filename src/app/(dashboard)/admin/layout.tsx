'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Home, Calendar, Users, Video, Settings, LogOut, Menu, X, BookOpen, Package, FileText, Mail, MessageSquare, Quote, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface User { id: string; email: string; firstName: string; lastName: string; role: 'ADMIN' | 'STUDENT'; avatar?: string }

const adminNavItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
  { href: '/admin/students', icon: Users, label: 'Students' },
  { href: '/admin/instruments', icon: Music, label: 'Instruments' },
  { href: '/admin/lessons', icon: Clock, label: 'Lessons' },
  { href: '/admin/recordings', icon: Video, label: 'Recordings' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/testimonials', icon: Quote, label: 'Testimonials' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchUser() }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (!res.ok || !data.user) { router.push('/login'); return }
      if (data.user.role !== 'ADMIN') { router.push('/dashboard'); return }
      setUser(data.user)
    } catch (error) { router.push('/login') }
    finally { setLoading(false) }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) { toast.error('Error logging out') }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-charcoal-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-charcoal-900 z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-charcoal-800 rounded-lg text-white">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold font-display text-white">ADMIN</span>
        </Link>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-charcoal-900 z-50 shadow-2xl">
              <SidebarContent user={user} pathname={pathname} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-charcoal-900">
        <SidebarContent user={user} pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
      <WhatsAppButton />
    </div>
  )
}

function SidebarContent({ user, pathname, onClose, onLogout }: { user: User; pathname: string; onClose?: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-charcoal-800 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold font-display block">MUSICAL MASTERS</span>
            <span className="text-xs text-charcoal-400">Admin Panel</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-charcoal-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-charcoal-700 scrollbar-track-transparent">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={cn('flex items-center gap-3 px-4 py-3 rounded-xl transition-all', isActive ? 'bg-coral-500 text-white' : 'text-charcoal-400 hover:bg-charcoal-800 hover:text-white')}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Fixed Bottom Section */}
      <div className="flex-shrink-0 border-t border-charcoal-800">
        {/* Current User Info */}
        <div className="p-4 border-b border-charcoal-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-coral-500 text-white">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-charcoal-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
