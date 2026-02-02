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

// Helper functions for local storage cart
const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const setLocalCart = (items: LocalCartItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
}

const clearLocalCart = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LOCAL_CART_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([])

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
      // Load from localStorage for non-logged-in users
      const localItems = getLocalCart()
      setLocalCartItems(localItems)

      // Fetch product details for local cart items
      if (localItems.length > 0) {
        try {
          const productIds = localItems.map(item => item.productId)
          const res = await fetch(`/api/products?ids=${productIds.join(',')}`)
          if (res.ok) {
            const data = await res.json()
            const products = data.products || []
            const cartWithProducts: CartItem[] = localItems.map((item, index) => {
              const product = products.find((p: any) => p.id === item.productId)
              return {
                id: `local-${index}`,
                productId: item.productId,
                quantity: item.quantity,
                product: product ? {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                } : {
                  id: item.productId,
                  name: 'Product',
                  price: 0,
                  image: '',
                }
              }
            }).filter(item => item.product.price > 0)
            setCartItems(cartWithProducts)
          }
        } catch {
          setCartItems([])
        }
      } else {
        setCartItems([])
      }
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
    if (!user) {
      // Handle local cart for non-logged-in users
      const localItems = getLocalCart()
      const existingIndex = localItems.findIndex(item => item.productId === productId)

      if (existingIndex >= 0) {
        localItems[existingIndex].quantity += quantity
      } else {
        localItems.push({ productId, quantity })
      }

      setLocalCart(localItems)
      await refreshCart()
      return true
    }
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
    if (!user) {
      // Handle local cart for non-logged-in users
      // itemId format is "local-{index}" or productId
      const localItems = getLocalCart()
      const cartItem = cartItems.find(item => item.id === itemId)
      if (cartItem) {
        const itemIndex = localItems.findIndex(item => item.productId === cartItem.productId)
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            localItems.splice(itemIndex, 1)
          } else {
            localItems[itemIndex].quantity = quantity
          }
          setLocalCart(localItems)
          await refreshCart()
          return true
        }
      }
      return false
    }
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
  }, [user, refreshCart, cartItems])

  const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
    if (!user) {
      // Handle local cart for non-logged-in users
      const localItems = getLocalCart()
      const cartItem = cartItems.find(item => item.id === itemId)
      if (cartItem) {
        const itemIndex = localItems.findIndex(item => item.productId === cartItem.productId)
        if (itemIndex >= 0) {
          localItems.splice(itemIndex, 1)
          setLocalCart(localItems)
          await refreshCart()
          return true
        }
      }
      return false
    }
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
  }, [user, refreshCart, cartItems])

  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!user) {
      // Clear local cart for non-logged-in users
      clearLocalCart()
      setLocalCartItems([])
      setCartItems([])
      return true
    }
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

  // Refresh cart when user changes or on initial load
  useEffect(() => {
    refreshCart()
  }, [user, refreshCart])

  // Load local cart on mount for non-logged-in users
  useEffect(() => {
    if (!loading && !user) {
      const localItems = getLocalCart()
      setLocalCartItems(localItems)
    }
  }, [loading, user])

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
