'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import styles from './ProductModal.module.css'
import { useStoreConfig } from '@/lib/useFirebaseData'
import { storeConfigData as fallbackConfig } from '@/lib/config'
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

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { config, loading } = useStoreConfig()
  // Use Firebase config if available, otherwise use fallback static data
  const storeConfigData = config || fallbackConfig

  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [mounted, setMounted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const bodyOverflowRef = useRef<string | null>(null)

  // Initialize
  useEffect(() => {
    setMounted(true)
    setImageLoading(true) // Reset loading state when product changes
    setSelectedSizes([]) // Reset selected sizes when product changes
    
    // Track product view when modal opens
    analytics.trackProductView(product.id, product.name)
  }, [product])

  // Handle body overflow - using useLayoutEffect for synchronous execution
  useLayoutEffect(() => {
    if (!mounted) return

    // Check if document and body exist
    if (typeof document === 'undefined' || !document.body) {
      return
    }

    const body = document.body
    
    // Save original overflow value
    bodyOverflowRef.current = body.style.overflow || ''
    
    // Set overflow to hidden
    body.style.overflow = 'hidden'

    // Cleanup function - restore original overflow
    return () => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          if (typeof document !== 'undefined' && document.body && bodyOverflowRef.current !== null) {
            document.body.style.overflow = bodyOverflowRef.current
            bodyOverflowRef.current = null
          }
        } catch (error) {
          // Silently ignore any errors during cleanup
          console.warn('Error restoring body overflow:', error)
        }
      })
    }
  }, [mounted])

  // Handle ESC key to close modal
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [mounted, onClose])

  const handleSizeToggle = (size: Size) => {
    setSelectedSizes(prev => {
      const isSelected = prev.some(s => s.size === size.size)
      if (isSelected) {
        return prev.filter(s => s.size !== size.size)
      } else {
        return [...prev, size]
      }
    })
  }

  const handleWhatsAppOrder = () => {
    if (selectedSizes.length === 0) return

    // Track order click (conversion event)
    selectedSizes.forEach(size => {
      analytics.trackOrderClick(
        product.id,
        product.name,
        size.size,
        size.price
      )
    })
    
    // Track WhatsApp click from modal
    analytics.trackWhatsAppClick('modal')

    const sizesText = selectedSizes.map(s => `${s.size} (${s.price} TND)`).join('، ')
    const totalPrice = selectedSizes.reduce((sum, s) => sum + s.price, 0)
    const message = `السلام عليكم، نحب نطلب عطر ${product.name}:\n${sizesText}\nالمجموع: ${totalPrice} TND`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${storeConfigData.whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const totalPrice = selectedSizes.reduce((sum, size) => sum + size.price, 0)

  const modalContent = (
    <div 
      className={styles.overlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="إغلاق">
          ×
        </button>
        
        <div className={styles.modalContent}>
          <div className={styles.imageSection}>
            <div className={styles.productImage}>
              {imageLoading && (
                <div className={styles.imagePlaceholder}>
                  <div className={styles.spinner}></div>
                </div>
              )}
        <Image
          src={product.image}
          alt={`${product.name} - ${product.description}`}
          fill
          className={styles.productImageContent}
          sizes="(max-width: 968px) 100vw, 50vw"
          style={{ objectFit: 'cover', opacity: imageLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          priority
          quality={90}
          unoptimized={product.image.startsWith('data:')}
        />
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h2 id="modal-title" className={styles.productName}>{product.name}</h2>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.sizeSelector}>
              <h3 className={styles.sizeTitle}>اختر الحجم (يمكن اختيار أكثر من حجم):</h3>
              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => {
                  const isSelected = selectedSizes.some(s => s.size === size.size)
                  return (
                  <label
                    key={size.size}
                    className={`${styles.sizeOption} ${
                      isSelected ? styles.sizeOptionActive : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        handleSizeToggle(size)
                        // Track size selection
                        analytics.trackSizeSelection(product.id, size.size, size.price)
                      }}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.sizeLabel}>{size.size}</span>
                  </label>
                )})}
              </div>
            </div>

            <div className={styles.priceDisplay}>
              <span className={styles.priceLabel}>السعر الإجمالي:</span>
              <span className={`${styles.priceValue} ${selectedSizes.length === 0 ? styles.priceValuePlaceholder : ''}`}>
                {selectedSizes.length > 0 ? `${totalPrice} TND` : 'اختر الحجم'}
              </span>
            </div>

            <button
              className={styles.orderButton}
              onClick={handleWhatsAppOrder}
              disabled={selectedSizes.length === 0}
            >
              <span>اطلب عبر واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Only render portal when mounted and document is available
  if (!mounted || typeof document === 'undefined' || !document.body) {
    return null
  }

  // Use a safe container check
  try {
    return createPortal(modalContent, document.body)
  } catch (error) {
    console.warn('Error creating portal:', error)
    return null
  }
}
