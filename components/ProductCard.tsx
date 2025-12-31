'use client'

import Image from 'next/image'
import styles from './ProductCard.module.css'
import { analytics } from '@/lib/analytics'

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

  const handleSelectClick = () => {
    // Track product card click
    analytics.trackProductCardClick(perfume.id, perfume.name)
    onSelect()
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={perfume.image}
          alt={perfume.name}
          fill
          className={styles.productImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{perfume.name}</h3>
        <p className={styles.description}>{perfume.description}</p>
        <div className={styles.priceContainer}>
          {minPrice === maxPrice ? (
            <span className={styles.price}>{minPrice} TND</span>
          ) : (
            <span className={styles.price}>حسب الحجم</span>
          )}
        </div>
        <button className={styles.selectButton} onClick={handleSelectClick}>
          اختر الحجم
        </button>
      </div>
    </div>
  )
}

