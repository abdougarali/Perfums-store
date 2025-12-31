import { MetadataRoute } from 'next'
import storeConfig from '@/data/store-config.json'

export default function robots(): MetadataRoute.Robots {
  // Get site URL from environment or use default
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
