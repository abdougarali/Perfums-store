'use client'

import styles from './Hero.module.css'
import { storeConfigData } from '@/lib/config'
import { analytics } from '@/lib/analytics'

export default function Hero() {
  const handleWhatsAppClick = () => {
    // Track WhatsApp click
    analytics.trackWhatsAppClick('hero')
    
    const whatsappUrl = `https://wa.me/${storeConfigData.whatsappNumber}`
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

