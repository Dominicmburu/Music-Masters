'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music,
  Home,
  Calendar,
  BookOpen,
  Video,
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'STUDENT'
  avatar?: string
}

const studentNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/book', icon: Calendar, label: 'Book a Lesson' },
  { href: '/dashboard/bookings', icon: BookOpen, label: 'My Bookings' },
  { href: '/dashboard/recordings', icon: Video, label: 'Class Recordings' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetchUser()
    fetchNotifications()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      
      if (!res.ok || !data.user) {
        router.push('/login')
        return
      }

      // Redirect admin to admin dashboard
      if (data.user.role === 'ADMIN') {
        router.push('/admin')
        return
      }

      setUser(data.user)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?unread=true')
      const data = await res.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Error logging out')
    }
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
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-charcoal-200 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-charcoal-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold font-display text-charcoal-900">MUSICAL MASTERS</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative">
              <Bell className="w-6 h-6 text-charcoal-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-semibold border-b">Notifications</div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-charcoal-500 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <DropdownMenuItem key={notif.id} className="p-3 flex flex-col items-start">
                  <span className="font-medium">{notif.title}</span>
                  <span className="text-xs text-charcoal-500">{notif.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
            >
              <SidebarContent
                user={user}
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
                navItems={studentNavItems}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-charcoal-200">
        <SidebarContent
          user={user}
          pathname={pathname}
          onLogout={handleLogout}
          navItems={studentNavItems}
        />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      <WhatsAppButton />
    </div>
  )
}

function SidebarContent({
  user,
  pathname,
  onClose,
  onLogout,
  navItems,
}: {
  user: User
  pathname: string
  onClose?: () => void
  onLogout: () => void
  navItems: typeof studentNavItems
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-charcoal-100 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold font-display text-charcoal-900 block">MUSICAL MASTERS</span>
            <span className="text-xs text-charcoal-400">Student Portal</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-charcoal-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-coral-500 text-white'
                  : 'text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Fixed Bottom Section */}
      <div className="flex-shrink-0 border-t border-charcoal-100">
        {/* Current User Info */}
        <div className="p-4 border-b border-charcoal-100">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-coral-100 text-coral-600">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-charcoal-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
