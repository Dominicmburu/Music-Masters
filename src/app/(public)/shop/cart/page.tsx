'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const WHATSAPP_NUMBER = '254784177547'

export default function CartPage() {
  const router = useRouter()
  const { user, loading, cartItems, updateCartItem, removeFromCart, clearCart, refreshCart } = useAuth()
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/shop/cart')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      refreshCart()
    }
  }, [user, refreshCart])

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItem(itemId)
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItem(itemId)
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setCheckingOut(true)

    // Generate WhatsApp message
    const itemsList = cartItems.map(item =>
      `${item.quantity}x ${item.product.name} - KSh ${(item.product.price * item.quantity).toLocaleString()}`
    ).join('\n')

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    const message = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n` +
      `*Order Details:*\n${itemsList}\n\n` +
      `*Subtotal:* KSh ${subtotal.toLocaleString()}\n\n` +
      `Customer: ${user?.firstName} ${user?.lastName}\n` +
      `Email: ${user?.email}\n\n` +
      `Please confirm availability and payment details.`
    )

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
    setCheckingOut(false)
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
      toast.success('Cart cleared')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      <section className="pt-32 pb-20 bg-charcoal-50 min-h-[80vh]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mb-8">
            Your Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingCart className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-charcoal-900 mb-2">Your cart is empty</h2>
                <p className="text-charcoal-600 mb-6">Looks like you haven't added any items yet.</p>
                <Link href="/shop">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingCart className="w-8 h-8 text-charcoal-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-charcoal-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-coral-600 font-bold mt-1">
                            KSh {item.product.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border border-charcoal-200 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItem === item.id || item.quantity <= 1}
                                className="p-2 hover:bg-charcoal-50 disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                {updatingItem === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItem === item.id}
                                className="p-2 hover:bg-charcoal-50 disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItem === item.id}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-charcoal-900">
                            KSh {(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleClearCart} className="text-red-600 border-red-200 hover:bg-red-50">
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-charcoal-600">
                      <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-charcoal-100 pt-4">
                      <div className="flex justify-between text-lg font-bold text-charcoal-900">
                        <span>Total</span>
                        <span>KSh {subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      disabled={checkingOut}
                      className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {checkingOut ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MessageCircle className="w-5 h-5" />
                      )}
                      Proceed to WhatsApp
                    </Button>
                    <p className="text-sm text-charcoal-500 text-center">
                      You'll be redirected to WhatsApp to complete your order
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
