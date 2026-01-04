import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import storeConfig from '@/data/store-config.json'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
  display: 'swap', // Font display optimization
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'

// Use specific product image for OG image (absolute URL)
const ogImage = `${siteUrl}/images/Perfum_img(21).png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: storeConfig.storeName,
    template: `%s | ${storeConfig.storeName}`,
  },
  description: 'اختر عطرك واطلب مباشرة عبر واتساب - عطور فاخرة لأناقة لا تُقاوم. متجر عطور أصلية مع توصيل سريع ودفع عند الاستلام.',
  keywords: ['عطور', 'عطور فاخرة', 'عطور أصلية', 'متجر عطور', 'طلب عطر عبر واتساب', 'عطور تونس', 'عطور أصلية تونس', 'عطور للرجال', 'عطور للنساء'],
  authors: [{ name: storeConfig.storeName }],
  creator: storeConfig.storeName,
  publisher: storeConfig.storeName,
  alternates: {
    canonical: '/',
  },
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
    alternateLocale: ['ar_TN', 'fr_FR'],
    siteName: storeConfig.storeName,
    url: siteUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 1200,
        alt: storeConfig.storeName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: storeConfig.storeName,
    description: 'اختر عطرك واطلب مباشرة عبر واتساب',
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when you have verification codes
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
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
      <head>
        {/* Critical resource hints - Load early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Performance hints */}
        <link rel="preconnect" href="https://wa.me" />
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        {/* Preload critical font */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" as="style" />
        {/* Additional Open Graph meta tags for better WhatsApp/Facebook support */}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:url" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={storeConfig.storeName} />
        {/* Twitter Card meta tags */}
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:src" content={ogImage} />
        <meta name="twitter:image:alt" content={storeConfig.storeName} />
      </head>
      <body className={cairo.variable}>
        <StructuredData />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

