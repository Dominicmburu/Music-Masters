'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'KEYBOARDS', label: 'Keyboards & Pianos' },
  { value: 'GUITARS', label: 'Guitars' },
  { value: 'DRUMS', label: 'Drums & Percussion' },
  { value: 'STRING', label: 'String Instruments' },
  { value: 'BRASS', label: 'Brass Instruments' },
  { value: 'WOODWIND', label: 'Woodwind Instruments' },
]

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'KEYBOARDS',
    image: '',
    stock: '0',
    isActive: true,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          stock: parseInt(formData.stock) || 0,
          isActive: formData.isActive,
        }),
      })

      if (res.ok) {
        toast.success('Product created successfully')
        router.push('/admin/products')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Add Product</h1>
          <p className="text-charcoal-500">Create a new shop product</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Product Image *</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 border-2 border-dashed border-charcoal-200 rounded-xl p-4 text-center cursor-pointer hover:border-coral-400 transition-colors"
              >
                {formData.image ? (
                  <div className="relative w-full h-48">
                    <Image src={formData.image} alt="Product" fill className="object-contain rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: '' }) }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="w-10 h-10 text-charcoal-400 mx-auto mb-2" />
                    <p className="text-charcoal-500">Click to upload image</p>
                    <p className="text-sm text-charcoal-400">Max 2MB, PNG or JPG</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Yamaha PSR-E373 Keyboard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KSh) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="30000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/products">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
