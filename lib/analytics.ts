/**
 * Google Analytics Event Tracking Utility
 * 
 * Usage:
 * - trackEvent('whatsapp_click', { location: 'hero' })
 * - trackEvent('product_view', { product_id: '1', product_name: 'عطر الفخامة' })
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Check if Google Analytics is loaded and configured
 */
export const isAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false
  return typeof window.gtag === 'function' && window.dataLayer !== undefined
}

/**
 * Track a custom event in Google Analytics
 * 
 * @param eventName - Name of the event (e.g., 'whatsapp_click', 'product_view')
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (!isAnalyticsEnabled()) {
    // Silently fail if analytics is not enabled
    return
  }

  try {
    window.gtag?.('event', eventName, {
      ...eventParams,
      // Add timestamp for better tracking
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Silently fail to avoid breaking the app
    console.warn('Analytics tracking error:', error)
  }
}

/**
 * Track page view (automatically handled by Next.js, but can be used for custom tracking)
 */
export const trackPageView = (url: string): void => {
  if (!isAnalyticsEnabled()) return

  try {
    window.gtag?.('config', 'page_view', {
      page_path: url,
    })
  } catch (error) {
    console.warn('Analytics page view error:', error)
  }
}

/**
 * Predefined event tracking functions for common actions
 */
export const analytics = {
  // WhatsApp clicks
  trackWhatsAppClick: (location: 'hero' | 'modal' | 'footer' | 'floating' | 'header') => {
    trackEvent('whatsapp_click', {
      event_category: 'engagement',
      event_label: location,
      location,
    })
  },

  // Product interactions
  trackProductView: (productId: string, productName: string) => {
    trackEvent('product_view', {
      event_category: 'product',
      event_label: productName,
      product_id: productId,
      product_name: productName,
    })
  },

  trackProductCardClick: (productId: string, productName: string) => {
    trackEvent('product_card_click', {
      event_category: 'product',
      event_label: productName,
      product_id: productId,
      product_name: productName,
    })
  },

  // Order tracking
  trackOrderClick: (productId: string, productName: string, size: string, price: number) => {
    trackEvent('order_click', {
      event_category: 'conversion',
      event_label: productName,
      product_id: productId,
      product_name: productName,
      size,
      price,
      currency: 'SAR',
    })
  },

  // Social media clicks
  trackSocialClick: (platform: 'instagram' | 'facebook') => {
    trackEvent('social_click', {
      event_category: 'engagement',
      event_label: platform,
      platform,
    })
  },

  // Size selection
  trackSizeSelection: (productId: string, size: string, price: number) => {
    trackEvent('size_selection', {
      event_category: 'product',
      product_id: productId,
      size,
      price,
    })
  },
}
