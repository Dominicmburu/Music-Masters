'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Music, User, ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, cartCount, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = pathname === '/'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    router.push('/')
  }

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin'
    return '/dashboard'
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-lg shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span
                className={cn(
                  'text-xl font-bold font-display transition-colors',
                  isScrolled || !isHomePage ? 'text-charcoal-900' : 'text-white'
                )}
              >
                MUSICAL MASTERS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative group',
                    pathname === link.href
                      ? 'text-coral-500'
                      : isScrolled || !isHomePage
                      ? 'text-charcoal-600 hover:text-coral-500'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-coral-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-charcoal-200 animate-pulse" />
              ) : user ? (
                <>
                  {/* Cart Icon */}
                  <Link
                    href="/shop/cart"
                    className={cn(
                      'relative p-2 rounded-lg transition-colors',
                      isScrolled || !isHomePage
                        ? 'text-charcoal-600 hover:text-coral-500 hover:bg-charcoal-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Avatar & Name */}
                  <div className={cn(
                    'flex items-center gap-2 px-2',
                    isScrolled || !isHomePage ? 'text-charcoal-700' : 'text-white'
                  )}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-coral-500 text-white text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {/* <span className="text-sm font-medium">{user.firstName}</span> */}
                  </div>

                  {/* Dashboard Button */}
                  <Link href={getDashboardLink()}>
                    <Button
                      variant={isScrolled || !isHomePage ? 'outline' : 'white'}
                      size="sm"
                      className="gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>

                  {/* Logout Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className={cn(
                      'gap-2',
                      isScrolled || !isHomePage
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        : 'text-white hover:bg-white/10'
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    variant={isScrolled || !isHomePage ? 'default' : 'white'}
                    size="sm"
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                isScrolled || !isHomePage
                  ? 'text-charcoal-900'
                  : 'text-white'
              )}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
            >
              <div className="p-6 pt-24">
                {/* User Info (Mobile) */}
                {user && (
                  <div className="mb-6 pb-6 border-b border-charcoal-100">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-coral-500 text-white">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-charcoal-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link
                        href="/shop/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="relative"
                      >
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="w-4 h-4" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-xs text-white flex items-center justify-center">
                              {cartCount > 9 ? '9+' : cartCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                          pathname === link.href
                            ? 'bg-coral-50 text-coral-600'
                            : 'text-charcoal-700 hover:bg-charcoal-50'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-charcoal-100">
                  {user ? (
                    <Button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2"
                      size="lg"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full gap-2" size="lg">
                        <User className="w-5 h-5" />
                        Login / Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
