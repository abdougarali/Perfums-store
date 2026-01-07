'use client'

import { useState, useMemo, memo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ProductCard from './ProductCard'
import ProductCarousel from './ProductCarousel'
import { useProducts, type Product } from '@/lib/useFirebaseData'
import perfumesDataStatic from '@/data/perfumes.json'
import styles from './ProductListing.module.css'

// Lazy load ProductModal - only load when needed (prefetch on hover)
const ProductModal = dynamic(() => import('./ProductModal'), {
  loading: () => null,
  ssr: false,
})

const GRID_ITEMS_COUNT = 6 // 2 rows × 3 columns

function ProductListing() {
  const { products: productsFromFirebase, loading, error } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Memoize product selection handler
  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])
  
  // Use static data immediately, then update with Firebase data when available
  // This improves initial page load performance
  // Memoize to prevent unnecessary re-renders
  const { perfumesData, gridProducts, carouselProducts } = useMemo(() => {
    // Check if Firebase is configured
    const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    
    let allProducts: Product[] = []
    
    // If Firebase is configured, wait for Firebase data to avoid showing inactive products
    // Otherwise, use static data immediately
    if (isFirebaseConfigured) {
      // Only use Firebase data (which has active flags)
      // Don't show static data first to avoid flash of inactive products
      if (!loading && productsFromFirebase.length > 0) {
        allProducts = productsFromFirebase
      } else if (loading) {
        // While loading, show empty array (or you could show a loading state)
        allProducts = []
      } else {
        // Firebase loaded but no products - fallback to static data
        allProducts = perfumesDataStatic as Product[]
      }
    } else {
      // Firebase not configured - use static data immediately
      allProducts = perfumesDataStatic as Product[]
    }
    
    // Filter: Only show active products - use more efficient filter
    const filtered = allProducts.filter(product => product.active !== false)
    
    return {
      perfumesData: filtered,
      gridProducts: filtered.slice(0, GRID_ITEMS_COUNT),
      carouselProducts: filtered.slice(GRID_ITEMS_COUNT)
    }
  }, [productsFromFirebase, loading])

  // Check if Firebase is configured
  const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  // Show loading state only if Firebase is configured and still loading
  const showLoading = isFirebaseConfigured && loading && productsFromFirebase.length === 0

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>مجموعة العطور</h2>
        <p className={styles.subtitle}>اكتشف مجموعتنا المميزة من {perfumesData.length} عطر فاخر</p>
        
        {showLoading ? (
          <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #E8C97A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <>
            {/* Grid Section - First 2 rows */}
            <div className={styles.grid}>
              {gridProducts.map((perfume, index) => (
                <ProductCard
                  key={perfume.id}
                  perfume={perfume}
                  onSelect={() => handleProductSelect(perfume)}
                  priority={index < 3} // Priority for first 3 images (above the fold)
                />
              ))}
            </div>

            {/* Carousel Section - Remaining items */}
            {carouselProducts.length > 0 && (
              <ProductCarousel
                products={carouselProducts}
                onSelect={handleProductSelect}
              />
            )}
          </>
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
