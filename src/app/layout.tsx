import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Musical Masters | Premier Music Education',
    template: '%s | Musical Masters',
  },
  description:
    'Transform your musical journey with expert instruction, premium instruments, and a passionate community dedicated to helping you master your craft.',
  keywords: [
    'music lessons',
    'piano lessons',
    'guitar lessons',
    'music education',
    'Nairobi music school',
    'Kenya music lessons',
    'learn music',
    'music studio',
  ],
  authors: [{ name: 'Musical Masters' }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://musicalmasters.com',
    siteName: 'Musical Masters',
    title: 'Musical Masters | Premier Music Education',
    description:
      'Transform your musical journey with expert instruction, premium instruments, and a passionate community.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Musical Masters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Musical Masters | Premier Music Education',
    description:
      'Transform your musical journey with expert instruction, premium instruments, and a passionate community.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ef4444" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1e',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
