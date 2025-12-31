import styles from './TrustSection.module.css'

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.featuresBar}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"/>
              </svg>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>توصيل سريع</h3>
              <p className={styles.featureDescription}>توصيل خلال 24-48 ساعة</p>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor"/>
              </svg>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>منتجات أصلية</h3>
              <p className={styles.featureDescription}>ضمان الجودة والأصالة</p>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"/>
              </svg>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>دفع آمن</h3>
              <p className={styles.featureDescription}>ادفع عند الاستلام</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
