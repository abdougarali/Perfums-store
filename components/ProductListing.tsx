'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import ProductCarousel from './ProductCarousel'
import perfumesData from '@/data/perfumes.json'
import styles from './ProductListing.module.css'

const GRID_ITEMS_COUNT = 6 // 2 rows × 3 columns

export default function ProductListing() {
  const [selectedProduct, setSelectedProduct] = useState<typeof perfumesData[0] | null>(null)

  // First 6 items for grid (2 rows)
  const gridProducts = perfumesData.slice(0, GRID_ITEMS_COUNT)
  
  // Remaining items for carousel
  const carouselProducts = perfumesData.slice(GRID_ITEMS_COUNT)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>مجموعة العطور</h2>
        <p className={styles.subtitle}>اكتشف مجموعتنا المميزة من {perfumesData.length} عطر فاخر</p>
        
        {/* Grid Section - First 2 rows */}
        <div className={styles.grid}>
          {gridProducts.map((perfume) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              onSelect={() => setSelectedProduct(perfume)}
            />
          ))}
        </div>

        {/* Carousel Section - Remaining items */}
        {carouselProducts.length > 0 && (
          <ProductCarousel
            products={carouselProducts}
            onSelect={(product) => setSelectedProduct(product)}
          />
        )}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}

