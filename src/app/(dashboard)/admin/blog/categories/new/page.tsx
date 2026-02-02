'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function NewBlogCategoryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categoryName, setCategoryName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName.trim() }),
      })

      if (res.ok) {
        toast.success('Category created successfully')
        router.push('/admin/blog/categories')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create category')
      }
    } catch (error) {
      toast.error('Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog/categories">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Add Category</h1>
          <p className="text-charcoal-500">Create a new blog category</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Piano, Guitar Tips, Music Theory"
              />
              <p className="text-xs text-charcoal-400">A URL-friendly slug will be generated automatically</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/blog/categories">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
