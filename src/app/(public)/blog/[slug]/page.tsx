// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation'
import BlogPostPage from './BlogPostPage'  // Make sure this component exists in the same folder

// Temporary inline blog data (you can later move this to a separate file or database)
const blogPosts = [
  {
    id: 1,
    slug: '10-tips-for-beginner-piano-players',
    title: '10 Tips for Beginner Piano Players',
    excerpt: 'Starting your piano journey? Here are essential tips to help you build a strong foundation and develop good habits from day one.',
    category: 'Piano',
    author: 'David Kimani',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    image: '/images/instruments/piano-beginner.jpg' // optional - add real image path if exists
  },
  {
    id: 2,
    slug: 'how-to-choose-your-first-guitar',
    title: 'How to Choose Your First Guitar',
    excerpt: 'Acoustic or electric? Nylon or steel strings? We break down everything you need to know when selecting your first guitar.',
    category: 'Guitar',
    author: 'Sarah Wanjiku',
    date: 'Dec 10, 2024',
    readTime: '7 min read',
    image: '/images/instruments/guitar-choose.jpg'
  },
  {
    id: 3,
    slug: 'benefits-of-music-education-for-children',
    title: 'The Benefits of Music Education for Children',
    excerpt: 'Research shows that learning music at a young age has profound effects on cognitive development, social skills, and emotional well-being.',
    category: 'Education',
    author: 'Grace Muthoni',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    image: '/images/instruments/kids-music.jpg'
  },
  {
    id: 4,
    slug: 'mastering-vocal-warm-ups-guide',
    title: 'Mastering Vocal Warm-ups: A Complete Guide',
    excerpt: 'Proper warm-ups are essential for vocal health and performance. Learn the techniques used by professional singers.',
    category: 'Vocals',
    author: 'Michael Omondi',
    date: 'Nov 28, 2024',
    readTime: '8 min read',
    image: '/images/instruments/vocal-warmup.jpg'
  },
  // Add more posts as needed...
]

// Helper function to find post by slug
function getPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug)
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Prepare full post data with content (this is where real article content goes)
  const fullPost = {
    ...post,
    content: `
      <h2>Introduction</h2>
      <p>This is the beginning of your full article. In a real application, this content would come from a CMS, Markdown file, or database.</p>
      
      <h2>Tip 1: Start with proper posture</h2>
      <p>Sitting correctly at the piano is crucial for avoiding tension and injury...</p>
      
      <h2>Tip 2: Learn proper hand position</h2>
      <p>Your fingers should be curved like you're holding an orange...</p>
      
      <p><em>Continue with the rest of the article content here...</em></p>
      
      <blockquote>
        "Practice doesn't make perfect. Perfect practice makes perfect." — Vince Lombardi
      </blockquote>
    `
    // You can make content dynamic per post if needed
  }

  return <BlogPostPage post={fullPost} />
}