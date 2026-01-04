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
      {/* Islamic Geometric Pattern Background */}
      <div className={styles.geometricPattern}></div>
      
      {/* Decorative Elements */}
      <div className={styles.decorativeCircle1}></div>
      <div className={styles.decorativeCircle2}></div>
      <div className={styles.decorativeCircle3}></div>
      
      {/* Arabic Calligraphy Decoration */}
      <div className={styles.arabicDecoration}>
        <span className={styles.arabicText}>عطر</span>
      </div>
      
      <div className={styles.container}>
        {/* Islamic Border Frame */}
        <div className={styles.frame}>
          <div className={styles.frameCorner}></div>
          <div className={styles.frameCorner}></div>
          <div className={styles.frameCorner}></div>
          <div className={styles.frameCorner}></div>
          
          <div className={styles.content}>
            {/* Bismillah or Islamic Greeting */}
            <div className={styles.islamicGreeting}>
              <span className={styles.greetingText}>بسم الله الرحمن الرحيم</span>
            </div>
            
            <h1 className={styles.headline}>
              <span className={styles.headlineMain}>عطور فاخرة</span>
              <span className={styles.headlineSub}>لأناقة لا تُقاوم</span>
            </h1>
            
            <p className={styles.subtitle}>
              <span className={styles.subtitleIcon}>✦</span>
              <span>اختر عطرك واطلب مباشرة عبر واتساب</span>
              <span className={styles.subtitleIcon}>✦</span>
            </p>
            
            <div className={styles.ctaContainer}>
              <button className={styles.ctaButton} onClick={handleWhatsAppClick}>
                <span className={styles.buttonText}>اطلب عبر واتساب</span>
                <span className={styles.buttonIcon}>💬</span>
              </button>
              <div className={styles.buttonShadow}></div>
            </div>
            
            {/* Decorative Arabic Pattern */}
            <div className={styles.arabicPattern}>
              <div className={styles.patternLine}></div>
              <div className={styles.patternDot}>●</div>
              <div className={styles.patternLine}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

