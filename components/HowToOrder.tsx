import styles from './HowToOrder.module.css'

export default function HowToOrder() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>كيف تطلب عطرك؟</h2>
        <div className={styles.stepsContainer}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <p className={styles.stepText}>اختر العطر الذي تريده</p>
          </div>

          {/* Arrow */}
          <div className={styles.arrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <p className={styles.stepText}>اختر الحجم واضغط "اطلب عبر واتساب"</p>
          </div>

          {/* Arrow */}
          <div className={styles.arrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <p className={styles.stepText}>أرسل الرسالة وسنتواصل معك لتأكيد الطلب</p>
          </div>
        </div>
      </div>
    </section>
  )
}
