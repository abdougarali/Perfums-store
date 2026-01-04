'use client'

import { useState, useMemo, memo } from 'react'
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
  priority?: boolean
}

function ProductCard({ perfume, onSelect, priority = false }: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  
  // Memoize price calculations
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = perfume.sizes.map(s => s.price)
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    }
  }, [perfume.sizes])

  const handleSelectClick = () => {
    // Track product card click
    analytics.trackProductCardClick(perfume.id, perfume.name)
    onSelect()
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imageLoading && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.spinner}></div>
          </div>
        )}
        <Image
          src={perfume.image}
          alt={`${perfume.name} - ${perfume.description}`}
          fill
          className={styles.productImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover', opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          quality={85}
          unoptimized={perfume.image.startsWith('data:')}
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

export default memo(ProductCard)
