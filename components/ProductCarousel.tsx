'use client'

import { memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ProductCard from './ProductCard'
import styles from './ProductCarousel.module.css'

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
  if (products.length === 0) return null

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Pagination]}
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
