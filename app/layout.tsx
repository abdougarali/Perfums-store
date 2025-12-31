import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import storeConfig from '@/data/store-config.json'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: storeConfig.storeName,
  description: 'اختر عطرك واطلب مباشرة عبر واتساب - عطور فاخرة لأناقة لا تُقاوم',
  keywords: ['عطور', 'عطور فاخرة', 'عطور أصلية', 'متجر عطور', 'طلب عطر عبر واتساب'],
  authors: [{ name: storeConfig.storeName }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: storeConfig.storeName,
    description: 'اختر عطرك واطلب مباشرة عبر واتساب - عطور فاخرة لأناقة لا تُقاوم',
    type: 'website',
    locale: 'ar_SA',
    siteName: storeConfig.storeName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: storeConfig.storeName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: storeConfig.storeName,
    description: 'اختر عطرك واطلب مباشرة عبر واتساب',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

