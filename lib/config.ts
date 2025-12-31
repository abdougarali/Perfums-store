import storeConfig from '@/data/store-config.json'

interface StoreConfig {
  storeName: string
  whatsappNumber: string
  instagram?: string
  facebook?: string
  googleAnalyticsId?: string
  generalWhatsAppMessage?: string
}

export const storeConfigData: StoreConfig = storeConfig

