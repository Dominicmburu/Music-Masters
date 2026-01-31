'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, MessageCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

const CATEGORIES = [
  { value: 'ALL', label: 'All Products' },
  { value: 'KEYBOARDS', label: 'Keyboards & Pianos' },
  { value: 'GUITARS', label: 'Guitars' },
  { value: 'DRUMS', label: 'Drums & Percussion' },
  { value: 'STRING', label: 'String Instruments' },
  { value: 'BRASS', label: 'Brass Instruments' },
  { value: 'WOODWIND', label: 'Woodwind Instruments' },
]

const getCategoryLabel = (value: string) => {
  return CATEGORIES.find(c => c.value === value)?.label || value
}

const WHATSAPP_NUMBER = '254784177547'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const { user, addToCart } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.products) setProducts(data.products)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    setAddingToCart(product.id)
    try {
      const success = await addToCart(product.id)
      if (success) {
        toast.success(`${product.name} added to cart`)
      } else {
        toast.error('Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleBuyNow = (product: Product) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in purchasing:\n\n` +
      `*${product.name}*\n` +
      `Price: KSh ${product.price.toLocaleString()}\n\n` +
      `Please let me know the next steps.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Group products by category for display
  const groupedProducts = CATEGORIES.filter(c => c.value !== 'ALL').reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(p => p.category === category.value)
    if (categoryProducts.length > 0) {
      acc.push({ ...category, products: categoryProducts })
    }
    return acc
  }, [] as Array<{ value: string; label: string; products: Product[] }>)

  return (
    <main className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Music Store</Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                Premium Instruments <span className="text-coral-500">at Great Prices</span>
              </h1>
              <p className="text-xl text-charcoal-300 mb-6">
                We carefully select high-quality instruments and price them to give you the best possible value in the Kenyan market.
              </p>
              <p className="text-lg text-charcoal-200 mb-8">
                Exceptional quality. Serious savings. Start playing with confidence today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Shop Now <ShoppingCart className="w-5 h-5" />
                </Button>
                <Link href="/lessons">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Explore Lessons
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/instruments/shop.jpg"
                alt="Beautiful music instruments on display"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="products" className="py-8 bg-white border-b border-charcoal-100 sticky top-20 z-30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? '' : 'hover:bg-coral-50 hover:text-coral-600 hover:border-coral-200'}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      {loading ? (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              <span className="ml-2 text-charcoal-600">Loading products...</span>
            </div>
          </div>
        </section>
      ) : filteredProducts.length === 0 ? (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ShoppingCart className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-charcoal-900 mb-2">No products found</h2>
            <p className="text-charcoal-600">Check back soon for new arrivals!</p>
          </div>
        </section>
      ) : selectedCategory === 'ALL' ? (
        // Show products grouped by category
        groupedProducts.map((category, index) => (
          <section
            key={category.value}
            className={`py-20 ${index % 2 === 0 ? 'bg-charcoal-50' : 'bg-white'}`}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
                  {category.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900 mt-2">
                  {category.label}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    user={user}
                    addingToCart={addingToCart}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        // Show filtered products in single section
        <section className="py-20 bg-charcoal-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-900">
                {getCategoryLabel(selectedCategory)}
              </h2>
              <p className="text-lg text-charcoal-600 mt-4">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  user={user}
                  addingToCart={addingToCart}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Value Emphasis CTA */}
      <section className="py-20 bg-coral-500">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
            Best Value in Kenya for Serious Musicians
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
            We combine premium brands, trusted quality, and pricing that makes learning music more accessible than ever.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="white" className="text-lg px-10 py-7">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProductCard({
  product,
  user,
  addingToCart,
  onAddToCart,
  onBuyNow,
}: {
  product: Product
  user: any
  addingToCart: string | null
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-coral-200 h-full group">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-56 rounded-t-xl overflow-hidden bg-charcoal-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ShoppingCart className="w-12 h-12 text-charcoal-300" />
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <Badge variant="secondary" className="w-fit mb-2">{getCategoryLabel(product.category)}</Badge>
          <h3 className="text-xl font-bold text-charcoal-900 mb-2 group-hover:text-coral-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-charcoal-600 mb-6 flex-grow line-clamp-3">
            {product.description}
          </p>
          <div className="mt-auto">
            <div className="text-3xl font-bold text-coral-500 mb-4">
              KSh {product.price.toLocaleString()}
            </div>
            <div className="flex gap-2">
              {user ? (
                <Button
                  className="flex-1 gap-2"
                  onClick={() => onAddToCart(product)}
                  disabled={addingToCart === product.id || product.stock <= 0}
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  Add to Cart
                </Button>
              ) : (
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Login to Buy
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => onBuyNow(product)}
              >
                <MessageCircle className="w-4 h-4" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
