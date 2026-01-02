'use client'

import { useEffect } from 'react'
import storeConfig from '@/data/store-config.json'
import perfumesData from '@/data/perfumes.json'

// Load structured data after initial render to not block LCP
export default function StructuredData() {
  useEffect(() => {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleLoad = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 })
      } else {
        setTimeout(callback, 100)
      }
    }

    scheduleLoad(() => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
    
    // Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: storeConfig.storeName,
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: `+${storeConfig.whatsappNumber}`,
        contactType: 'customer service',
        availableLanguage: ['Arabic', 'French'],
      },
      sameAs: [
        storeConfig.instagram,
        storeConfig.facebook,
      ].filter(Boolean),
    }

    // LocalBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: storeConfig.storeName,
      description: 'متجر عطور فاخرة - اختر عطرك واطلب مباشرة عبر واتساب',
      url: siteUrl,
      telephone: `+${storeConfig.whatsappNumber}`,
      priceRange: '$$',
      image: `${siteUrl}/og-image.jpg`,
    }

    // Product Schema for all perfumes
    const productSchemas = perfumesData.map((perfume) => {
      const minPrice = Math.min(...perfume.sizes.map(s => s.price))
      const maxPrice = Math.max(...perfume.sizes.map(s => s.price))
      
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: perfume.name,
        description: perfume.description,
        image: `${siteUrl}${perfume.image}`,
        brand: {
          '@type': 'Brand',
          name: storeConfig.storeName,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'TND',
          lowPrice: minPrice,
          highPrice: maxPrice,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '10',
        },
      }
    })

    // Website Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: storeConfig.storeName,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // Add all schemas to page
    const schemas = [
      organizationSchema,
      localBusinessSchema,
      websiteSchema,
      ...productSchemas,
    ]

      schemas.forEach((schema) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.text = JSON.stringify(schema)
        script.id = `schema-${schema['@type']}`
        document.head.appendChild(script)
      })
    })

    // Cleanup function
    return () => {
      // Remove all schema scripts on unmount
      const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]')
      schemaScripts.forEach((script) => {
        if (script.id && script.id.startsWith('schema-')) {
          script.remove()
        }
      })
    }
  }, [])

  return null
}
