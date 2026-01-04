'use client'

import { useState, useEffect, useMemo } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from './firebase'

export interface Product {
  id: string
  name: string
  description: string
  image: string
  sizes: Array<{ size: string; price: number }>
  active?: boolean // Product visibility: true = visible, false = hidden
}

interface StoreConfig {
  storeName: string
  whatsappNumber: string
  instagram?: string
  facebook?: string
  googleAnalyticsId?: string
  generalWhatsAppMessage?: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Firebase is configured and available
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !db) {
      setError('Firebase not configured')
      setLoading(false)
      return
    }

    const productsRef = ref(db, 'products')
    
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Convert object to array if needed
          const productsArray = Array.isArray(data) ? data : Object.values(data)
          // Only update if data actually changed (prevents unnecessary re-renders)
          setProducts(prev => {
            const newData = productsArray as Product[]
            // Simple comparison - update only if length or IDs changed
            if (prev.length !== newData.length || 
                prev.some((p, i) => p.id !== newData[i]?.id)) {
              return newData
            }
            return prev
          })
        } else {
          setProducts([])
        }
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching products:', error)
        setError('Failed to load products')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { products, loading, error }
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Firebase is configured and available
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !db) {
      setError('Firebase not configured')
      setLoading(false)
      return
    }

    const configRef = ref(db, 'config')
    
    const unsubscribe = onValue(
      configRef,
      (snapshot) => {
        const data = snapshot.val()
        setConfig(data as StoreConfig)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching config:', error)
        setError('Failed to load config')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { config, loading, error }
}
