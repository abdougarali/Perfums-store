import styles from './FAQ.module.css'

export default function FAQ() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>أسئلة شائعة</h2>
        <div className={styles.faqList}>
          {/* Question 1 */}
          <div className={styles.faqItem}>
            <h3 className={styles.question}>💳 كيف يمكنني الدفع؟</h3>
            <p className={styles.answer}>الدفع يتم نقداً عند الاستلام. لا حاجة للدفع مسبقاً.</p>
          </div>

          {/* Question 2 */}
          <div className={styles.faqItem}>
            <h3 className={styles.question}>📦 كم تستغرق مدة التوصيل؟</h3>
            <p className={styles.answer}>نوصل الطلبات خلال 24-48 ساعة حسب موقعك. سيتم التواصل معك عبر واتساب لتأكيد العنوان.</p>
          </div>

          {/* Question 3 */}
          <div className={styles.faqItem}>
            <h3 className={styles.question}>✨ هل جميع العطور أصلية؟</h3>
            <p className={styles.answer}>نعم، جميع العطور أصلية ومضمونة الجودة. نضمن الأصالة والجودة.</p>
          </div>

          {/* Question 4 */}
          <div className={styles.faqItem}>
            <h3 className={styles.question}>🛒 هل يمكنني طلب أكثر من عطر؟</h3>
            <p className={styles.answer}>نعم بالطبع! يمكنك طلب أي عدد من العطور. فقط اختر العطور التي تريدها واضغط على زر &quot;اطلب عبر واتساب&quot; لكل عطر.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
