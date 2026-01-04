'use client'

import { useState, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import ProductCard from './ProductCard'
import ProductCarousel from './ProductCarousel'
import { useProducts, type Product } from '@/lib/useFirebaseData'
import perfumesDataStatic from '@/data/perfumes.json'
import styles from './ProductListing.module.css'

// Lazy load ProductModal - only load when needed
const ProductModal = dynamic(() => import('./ProductModal'), {
  loading: () => null,
  ssr: false,
})

const GRID_ITEMS_COUNT = 6 // 2 rows × 3 columns

function ProductListing() {
  const { products: productsFromFirebase, loading, error } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Use static data immediately, then update with Firebase data when available
  // This improves initial page load performance
  const { perfumesData, gridProducts, carouselProducts } = useMemo(() => {
    // Start with static data for immediate render
    let allProducts = perfumesDataStatic as Product[]
    
    // Update with Firebase data if available (and not loading)
    if (!loading && productsFromFirebase.length > 0) {
      allProducts = productsFromFirebase
    }
    
    // Filter: Only show active products
    const filtered = allProducts.filter(product => {
      if (product.active === false) return false
      return true
    })
    
    return {
      perfumesData: filtered,
      gridProducts: filtered.slice(0, GRID_ITEMS_COUNT),
      carouselProducts: filtered.slice(GRID_ITEMS_COUNT)
    }
  }, [productsFromFirebase, loading])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>مجموعة العطور</h2>
        <p className={styles.subtitle}>اكتشف مجموعتنا المميزة من {perfumesData.length} عطر فاخر</p>
        
        {/* Grid Section - First 2 rows */}
        <div className={styles.grid}>
          {gridProducts.map((perfume, index) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              onSelect={() => setSelectedProduct(perfume)}
              priority={index < 3} // Priority for first 3 images (above the fold)
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

export default memo(ProductListing)
