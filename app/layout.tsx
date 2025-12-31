import type { Metadata } from 'next'
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
  openGraph: {
    title: storeConfig.storeName,
    description: 'اختر عطرك واطلب مباشرة عبر واتساب - عطور فاخرة لأناقة لا تُقاوم',
    type: 'website',
    locale: 'ar_SA',
    siteName: storeConfig.storeName,
  },
  twitter: {
    card: 'summary_large_image',
    title: storeConfig.storeName,
    description: 'اختر عطرك واطلب مباشرة عبر واتساب',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
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
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

