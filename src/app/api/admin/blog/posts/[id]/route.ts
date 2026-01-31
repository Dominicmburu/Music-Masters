import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
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
    const body = await req.json()

    const existingPost = await prisma.blogPost.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Validate image size if provided
    if (body.coverImage && body.coverImage.length > 2.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Cover image too large. Maximum size is 2MB' }, { status: 400 })
    }

    // Handle slug update if title changed
    let slug = existingPost.slug
    if (body.title && body.title !== existingPost.title) {
      slug = generateSlug(body.title)
      let slugExists = await prisma.blogPost.findFirst({
        where: { slug, NOT: { id } },
      })
      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(body.title)}-${counter}`
        slugExists = await prisma.blogPost.findFirst({
          where: { slug, NOT: { id } },
        })
        counter++
      }
    }

    // Handle publish status change
    let publishedAt = existingPost.publishedAt
    if (body.isPublished !== undefined) {
      if (body.isPublished && !existingPost.isPublished) {
        publishedAt = new Date()
      } else if (!body.isPublished) {
        publishedAt = null
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title, slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt || null }),
        ...(body.content && { content: body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId || null }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished, publishedAt }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
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

    const existingPost = await prisma.blogPost.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.blogPost.delete({ where: { id } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
