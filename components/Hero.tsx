'use client'

import styles from './Hero.module.css'
import { useStoreConfig } from '@/lib/useFirebaseData'
import { storeConfigData as fallbackConfig } from '@/lib/config'
import { analytics } from '@/lib/analytics'

export default function Hero() {
  const { config, loading } = useStoreConfig()
  // Use Firebase config if available, otherwise use fallback static data
  const storeConfigData = config || fallbackConfig

  const handleWhatsAppClick = () => {
    // Track WhatsApp click
    analytics.trackWhatsAppClick('hero')
    
    // General message for header/footer
    const generalMessage = storeConfigData.generalWhatsAppMessage || 'السلام عليكم، أريد الاستفسار عن العطور المتوفرة'
    const encodedMessage = encodeURIComponent(generalMessage)
    const whatsappUrl = `https://wa.me/${storeConfigData.whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.headline}>عطور فاخرة لأناقة لا تُقاوم</h1>
        <p className={styles.subtitle}>اختر عطرك واطلب مباشرة عبر واتساب</p>
        <button className={styles.ctaButton} onClick={handleWhatsAppClick}>
          اطلب عبر واتساب
        </button>
      </div>
    </section>
  )
}

