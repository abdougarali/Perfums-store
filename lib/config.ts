import storeConfigStatic from '@/data/store-config.json'

export interface StoreConfig {
  storeName: string
  whatsappNumber: string
  instagram?: string
  facebook?: string
  googleAnalyticsId?: string
  generalWhatsAppMessage?: string
}

// For Server Components - use static data as fallback
export const storeConfigData: StoreConfig = storeConfigStatic as StoreConfig

// For Client Components - use useStoreConfig hook from useFirebaseData.ts
// This allows real-time updates from Firebase

