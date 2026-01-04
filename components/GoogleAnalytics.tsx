'use client'

import Script from 'next/script'
import { storeConfigData } from '@/lib/config'

/**
 * Google Analytics Component
 * 
 * This component loads Google Analytics only if googleAnalyticsId is configured.
 * It's safe to use even if the ID is not set (won't cause errors).
 */
export default function GoogleAnalytics() {
  const gaId = storeConfigData.googleAnalyticsId

  // Don't render if Google Analytics ID is not set
  if (!gaId || gaId.trim() === '') {
    return null
  }

  return (
    <>
      {/* Google Analytics Scripts - Load with lowest priority */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  )
}
