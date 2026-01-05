'use client'

import { memo, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ProductCard from './ProductCard'
import styles from './ProductCarousel.module.css'

// Lazy load Swiper components to reduce initial bundle size
const Swiper = dynamic(
  () => import('swiper/react').then(mod => mod.Swiper),
  { ssr: false }
)

const SwiperSlide = dynamic(
  () => import('swiper/react').then(mod => mod.SwiperSlide),
  { ssr: false }
)

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

interface ProductCarouselProps {
  products: Product[]
  onSelect: (product: Product) => void
}

function ProductCarousel({ products, onSelect }: ProductCarouselProps) {
  const [modules, setModules] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Load Swiper modules and CSS only when component mounts
    Promise.all([
      import('swiper/modules').then(mod => mod),
      import('swiper/css'),
      import('swiper/css/navigation'),
      import('swiper/css/pagination')
    ]).then(([modulesMod]) => {
      setModules(modulesMod)
      setIsReady(true)
    })
  }, [])

  if (products.length === 0) return null

  if (!isReady || !modules) {
    return (
      <div className={styles.carouselContainer}>
        <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #E8C97A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[modules.Navigation, modules.Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        slidesPerGroup={1}
        navigation
        pagination={{ clickable: true }}
        initialSlide={6} // Start at slide number 7 (0-indexed)
        breakpoints={{
          640: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 1,
          },
        }}
        className={styles.swiper}
      >
        {products.map((perfume) => (
          <SwiperSlide key={perfume.id} className={styles.swiperSlide}>
            <ProductCard
              perfume={perfume}
              onSelect={() => onSelect(perfume)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default memo(ProductCarousel)
