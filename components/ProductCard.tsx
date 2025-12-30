'use client'

import styles from './ProductCard.module.css'

interface Size {
  size: string
  price: number
}

interface Product {
  id: string
  name: string
  description: string
  image: string
  sizes: Size[]
}

interface ProductCardProps {
  perfume: Product
  onSelect: () => void
}

export default function ProductCard({ perfume, onSelect }: ProductCardProps) {
  const minPrice = Math.min(...perfume.sizes.map(s => s.price))
  const maxPrice = Math.max(...perfume.sizes.map(s => s.price))

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.placeholderImage}>
          <span className={styles.imageText}>{perfume.name}</span>
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{perfume.name}</h3>
        <p className={styles.description}>{perfume.description}</p>
        <div className={styles.priceContainer}>
          {minPrice === maxPrice ? (
            <span className={styles.price}>{minPrice} ريال</span>
          ) : (
            <span className={styles.price}>حسب الحجم</span>
          )}
        </div>
        <button className={styles.selectButton} onClick={onSelect}>
          اختر الحجم
        </button>
      </div>
    </div>
  )
}

