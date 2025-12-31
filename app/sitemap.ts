import { MetadataRoute } from 'next'
import storeConfig from '@/data/store-config.json'

export default function sitemap(): MetadataRoute.Sitemap {
  // Get site URL from environment or use default
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'

  const baseUrl = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }

  return [baseUrl]
}
