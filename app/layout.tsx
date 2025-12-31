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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: storeConfig.storeName,
    template: `%s | ${storeConfig.storeName}`,
  },
  description: 'اختر عطرك واطلب مباشرة عبر واتساب - عطور فاخرة لأناقة لا تُقاوم',
  keywords: ['عطور', 'عطور فاخرة', 'عطور أصلية', 'متجر عطور', 'طلب عطر عبر واتساب', 'عطور تونس', 'عطور أصلية تونس'],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload critical images for LCP improvement */}
        <link rel="preload" as="image" href="/images/Perfum_img(1).png .png" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/Perfum_img(2).png" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/Perfum_img(3).png" fetchPriority="high" />
        {/* Critical CSS for Hero section - improves FCP and LCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{margin:0;padding:0;font-family:var(--font-cairo),-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background-color:#FAF9F7;color:#1A2332}
            .hero{background:linear-gradient(135deg,#0F1419 0%,#1A2332 50%,#2C3E50 100%);color:#fff;padding:50px 20px 40px;text-align:center;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
            .hero .container{max-width:900px;margin:0 auto;position:relative;z-index:1}
            .hero h1{font-size:2.5rem;font-weight:700;margin-bottom:16px;line-height:1.3;letter-spacing:-0.02em;background:linear-gradient(135deg,#fff 0%,#e8e8e8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .hero p{font-size:1.1rem;margin-bottom:28px;color:#d0d0d0;font-weight:400;line-height:1.6;max-width:600px;margin-left:auto;margin-right:auto}
            .hero button{background:linear-gradient(135deg,#C9A961 0%,#B8941F 100%);color:#0F1419;padding:16px 40px;font-size:1rem;font-weight:700;border-radius:50px;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(201,169,97,0.3)}
            @media(max-width:768px){.hero{padding:40px 20px 32px}.hero h1{font-size:1.85rem;margin-bottom:12px}.hero p{font-size:0.95rem;margin-bottom:24px}}
          `
        }} />
      </head>
      <body className={cairo.variable}>
        <StructuredData />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

