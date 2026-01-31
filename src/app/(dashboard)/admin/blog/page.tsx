'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FileText, Search, Plus, Edit, Trash2, Eye, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  categoryId: string | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  category: { id: string; name: string; slug: string } | null
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog/posts')
      const data = await res.json()
      if (data.posts) setPosts(data.posts)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/blog/categories')
      const data = await res.json()
      if (data.categories) setCategories(data.categories)
    } catch (error) {
      console.error('Failed to load categories')
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/blog/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Post deleted successfully')
        fetchPosts()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || p.categoryId === filterCategory
    const matchesStatus = filterStatus === 'ALL' ||
      (filterStatus === 'PUBLISHED' && p.isPublished) ||
      (filterStatus === 'DRAFT' && !p.isPublished)
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Blog Posts</h1>
            <p className="text-charcoal-500 mt-1">Manage your blog content</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/blog/categories">
              <Button variant="outline">Manage Categories</Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button className="gap-2">
                <Plus className="w-5 h-5" />New Post
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <Input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-[180px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-[150px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-coral-500" />
              All Posts ({filteredPosts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No posts found</p>
                <Link href="/admin/blog/new">
                  <Button className="mt-4">Create Your First Post</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex gap-4 p-4 border border-charcoal-100 rounded-xl hover:bg-charcoal-50 transition-colors">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-8 h-8 text-charcoal-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-charcoal-900 truncate">{post.title}</h3>
                          <p className="text-sm text-charcoal-500 line-clamp-2 mt-1">{post.excerpt || 'No excerpt'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-5 h-5" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>View Post</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/blog/${post.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="w-5 h-5" />
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
                                onClick={() => handleDelete(post)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={post.isPublished ? 'success' : 'secondary'}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        {post.category && (
                          <Badge variant="outline">{post.category.name}</Badge>
                        )}
                        <span className="text-sm text-charcoal-400">
                          {post.publishedAt ? formatDate(post.publishedAt, 'MMM d, yyyy') : formatDate(post.createdAt, 'MMM d, yyyy')}
                        </span>
                      </div>
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
