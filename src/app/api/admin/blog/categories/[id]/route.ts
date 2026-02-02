import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const existingCategory = await prisma.blogCategory.findUnique({ where: { id } })
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if name already exists for another category
    const nameExists = await prisma.blogCategory.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, NOT: { id } },
    })
    if (nameExists) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug
    if (name !== existingCategory.name) {
      slug = generateSlug(name)
      let slugExists = await prisma.blogCategory.findFirst({
        where: { slug, NOT: { id } },
      })
      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(name)}-${counter}`
        slugExists = await prisma.blogCategory.findFirst({
          where: { slug, NOT: { id } },
        })
        counter++
      }
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: { name, slug },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating blog category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (existingCategory._count.posts > 0) {
      // Unlink posts from category instead of preventing deletion
      await prisma.blogPost.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      })
    }

    await prisma.blogCategory.delete({ where: { id } })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
