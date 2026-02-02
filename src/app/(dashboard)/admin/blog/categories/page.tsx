'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'

interface BlogCategory {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/blog/categories')
      const data = await res.json()
      if (data.categories) setCategories(data.categories)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category: BlogCategory) => {
    const message = category._count.posts > 0
      ? `Are you sure you want to delete "${category.name}"? This category has ${category._count.posts} posts that will be uncategorized.`
      : `Are you sure you want to delete "${category.name}"?`

    if (!confirm(message)) return

    try {
      const res = await fetch(`/api/admin/blog/categories/${category.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Category deleted')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold font-display text-charcoal-900">Blog Categories</h1>
              <p className="text-charcoal-500 mt-1">Organize your blog posts</p>
            </div>
          </div>
          <Link href="/admin/blog/categories/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />Add Category
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-coral-500" />
              All Categories ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No categories yet</p>
                <Link href="/admin/blog/categories/new">
                  <Button className="mt-4">Create Your First Category</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-charcoal-100 rounded-xl hover:bg-charcoal-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{category.name}</h3>
                      <p className="text-sm text-charcoal-500">/{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{category._count.posts} posts</Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/admin/blog/categories/${category.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
