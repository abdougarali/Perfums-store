'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './ProductModal.module.css'
import { storeConfigData } from '@/lib/config'

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

  // Initialize
  useEffect(() => {
    setMounted(true)
    if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
  }, [product])

  // Handle body overflow
  useEffect(() => {
    if (!mounted || typeof document === 'undefined' || !document.body) return

    const body = document.body
    const originalOverflow = body.style.overflow || ''
    body.style.overflow = 'hidden'

    return () => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          if (typeof document !== 'undefined' && document.body) {
            document.body.style.overflow = originalOverflow
          }
        } catch (error) {
          // Ignore errors
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

  const handleWhatsAppOrder = () => {
    if (!selectedSize) return

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
              <span className={styles.imageText}>{product.name}</span>
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
                    onClick={() => setSelectedSize(size)}
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

  if (!mounted || typeof document === 'undefined' || !document.body) {
    return null
  }

  return createPortal(modalContent, document.body)
}
