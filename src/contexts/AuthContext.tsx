'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: 'ADMIN' | 'STUDENT'
  isActive: boolean
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

interface LocalCartItem {
  productId: string
  quantity: number
}

const LOCAL_CART_KEY = 'musical_masters_cart'

interface AuthContextType {
  user: User | null
  loading: boolean
  cartItems: CartItem[]
  cartCount: number
  refreshUser: () => Promise<void>
  refreshCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<boolean>
  updateCartItem: (itemId: string, quantity: number) => Promise<boolean>
  removeFromCart: (itemId: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      return
    }
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCartItems(data.cart?.items || [])
      }
    } catch {
      setCartItems([])
    }
  }, [user])

  const addToCart = useCallback(async (productId: string, quantity: number = 1): Promise<boolean> => {
    if (!user) return false
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      if (res.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch {
      return false
    }
  }, [user, refreshCart])

  const updateCartItem = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
    if (!user) return false
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (res.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch {
      return false
    }
  }, [user, refreshCart])

  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    if (!user) return false
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await refreshCart()
        return true
      }
      return false
    } catch {
      return false
    }
  }, [user, refreshCart])

  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!user) return false
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      })
      if (res.ok) {
        setCartItems([])
        return true
      }
      return false
    } catch {
      return false
    }
  }, [user])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setCartItems([])
    } catch {
      // Silent fail
    }
  }, [])

  // Initial load
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // Refresh cart when user changes
  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [user, refreshCart])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cartItems,
        cartCount,
        refreshUser,
        refreshCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
