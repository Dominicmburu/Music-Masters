'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Package, Search, Plus, Edit, Trash2, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  isActive: boolean
  createdAt: string
  _count?: { cartItems: number }
}

const CATEGORIES = [
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products?includeInactive=true')
      const data = await res.json()
      if (data.products) setProducts(data.products)
    } catch (error) { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Products</h1>
            <p className="text-charcoal-500 mt-1">Manage your shop products</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="gap-2"><Plus className="w-5 h-5" />Add Product</Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-[200px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-coral-500" />
              All Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">{searchQuery || filterCategory !== 'ALL' ? 'No products found matching your criteria' : 'No products yet'}</p>
                <Link href="/admin/products/new">
                  <Button className="mt-4">Add Your First Product</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-charcoal-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-charcoal-50">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-12 h-12 text-charcoal-300" />
                        </div>
                      )}
                      {!product.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Inactive</Badge>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="secondary" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">{getCategoryLabel(product.category)}</Badge>
                      <h3 className="font-semibold text-charcoal-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-charcoal-500 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-coral-600">KSh {product.price.toLocaleString()}</span>
                        <span className="text-sm text-charcoal-400">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
