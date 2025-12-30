import styles from './TrustSection.module.css'

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>لماذا نحن؟</h2>
        <div className={styles.grid}>
          <div className={styles.item}>
            <div className={styles.icon}>🚚</div>
            <h3 className={styles.itemTitle}>توصيل سريع</h3>
            <p className={styles.itemDescription}>نوصل طلبك بأسرع وقت ممكن</p>
          </div>
          <div className={styles.item}>
            <div className={styles.icon}>✓</div>
            <h3 className={styles.itemTitle}>منتجات أصلية</h3>
            <p className={styles.itemDescription}>ضمان جودة وأصالة المنتجات</p>
          </div>
          <div className={styles.item}>
            <div className={styles.icon}>💳</div>
            <h3 className={styles.itemTitle}>دفع عند الاستلام</h3>
            <p className={styles.itemDescription}>ادفع عند استلام طلبك</p>
          </div>
        </div>
      </div>
    </section>
  )
}

