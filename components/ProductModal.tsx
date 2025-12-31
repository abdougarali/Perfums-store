'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import styles from './ProductModal.module.css'
import { storeConfigData } from '@/lib/config'
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
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [mounted, setMounted] = useState(false)
  const bodyOverflowRef = useRef<string | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Initialize
  useEffect(() => {
    setMounted(true)
    if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
    
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

    // Create cleanup function
    const cleanup = () => {
      // Use multiple safety checks
      if (typeof document === 'undefined' || !document.body) {
        return
      }

      try {
        const currentBody = document.body
        if (currentBody && bodyOverflowRef.current !== null) {
          currentBody.style.overflow = bodyOverflowRef.current
          bodyOverflowRef.current = null
        }
      } catch (error) {
        // Silently ignore any errors during cleanup
        console.warn('Error restoring body overflow:', error)
      }
    }

    cleanupRef.current = cleanup

    return () => {
      // Use setTimeout to ensure cleanup happens after React finishes
      const timeoutId = setTimeout(() => {
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = null
        }
      }, 0)

      // Also try with requestAnimationFrame as backup
      requestAnimationFrame(() => {
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = null
        }
      })

      return () => {
        clearTimeout(timeoutId)
      }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  const handleWhatsAppOrder = () => {
    if (!selectedSize) return

    // Track order click (conversion event)
    analytics.trackOrderClick(
      product.id,
      product.name,
      selectedSize.size,
      selectedSize.price
    )
    
    // Track WhatsApp click from modal
    analytics.trackWhatsAppClick('modal')

    const message = `السلام عليكم، نحب نطلب عطر ${product.name} حجم ${selectedSize.size} بسعر ${selectedSize.price} ريال.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${storeConfigData.whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

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
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.productImageContent}
                sizes="(max-width: 968px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h2 id="modal-title" className={styles.productName}>{product.name}</h2>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.sizeSelector}>
              <h3 className={styles.sizeTitle}>اختر الحجم:</h3>
              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    className={`${styles.sizeButton} ${
                      selectedSize?.size === size.size ? styles.sizeButtonActive : ''
                    }`}
                    onClick={() => {
                      setSelectedSize(size)
                      // Track size selection
                      analytics.trackSizeSelection(product.id, size.size, size.price)
                    }}
                  >
                    <span className={styles.sizeLabel}>{size.size}</span>
                    <span className={styles.sizePrice}>{size.price} ريال</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedSize && (
              <div className={styles.priceDisplay}>
                <span className={styles.priceLabel}>السعر:</span>
                <span className={styles.priceValue}>{selectedSize.price} ريال</span>
              </div>
            )}

            <button
              className={styles.orderButton}
              onClick={handleWhatsAppOrder}
              disabled={!selectedSize}
            >
              اطلب عبر واتساب
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
