'use client'

import { useState, useEffect, useMemo, useRef, startTransition } from 'react'
import { ref, onValue, get } from 'firebase/database'
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

// Cache Firebase data in memory to avoid redundant requests
let cachedProducts: Product[] | null = null
let cachedConfig: StoreConfig | null = null
let productsPromise: Promise<Product[]> | null = null
let configPromise: Promise<StoreConfig | null> | null = null

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Check if Firebase is configured and available
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !db) {
      setError('Firebase not configured')
      setLoading(false)
      return
    }

    // Return cached data immediately if available
    if (cachedProducts) {
      setProducts(cachedProducts)
      setLoading(false)
      return
    }

    // Reuse existing promise if already fetching
    if (productsPromise) {
      productsPromise
        .then((data) => {
          if (mountedRef.current) {
            setProducts(data)
            setLoading(false)
            setError(null)
          }
        })
        .catch((err) => {
          if (mountedRef.current) {
            console.error('Error fetching products:', err)
            setError('Failed to load products')
            setLoading(false)
          }
        })
      return
    }

    // Create new fetch promise
    const productsRef = ref(db, 'products')
    productsPromise = get(productsRef)
      .then((snapshot) => {
        const data = snapshot.val()
        let productsArray: Product[] = []
        if (data) {
          // Convert object to array if needed
          productsArray = Array.isArray(data) ? data : Object.values(data)
        }
        // Cache the result
        cachedProducts = productsArray
        return productsArray
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        throw error
      })

    productsPromise
      .then((data) => {
        if (mountedRef.current) {
          // Use startTransition to defer non-critical updates
          startTransition(() => {
            setProducts(data)
            setLoading(false)
            setError(null)
          })
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError('Failed to load products')
          setLoading(false)
        }
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { products, loading, error }
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Check if Firebase is configured and available
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !db) {
      setError('Firebase not configured')
      setLoading(false)
      return
    }

    // Return cached data immediately if available
    if (cachedConfig) {
      setConfig(cachedConfig)
      setLoading(false)
      return
    }

    // Reuse existing promise if already fetching
    if (configPromise) {
      configPromise
        .then((data) => {
          if (mountedRef.current) {
            setConfig(data)
            setLoading(false)
            setError(null)
          }
        })
        .catch((err) => {
          if (mountedRef.current) {
            console.error('Error fetching config:', err)
            setError('Failed to load config')
            setLoading(false)
          }
        })
      return
    }

    // Create new fetch promise
    const configRef = ref(db, 'config')
    configPromise = get(configRef)
      .then((snapshot) => {
        const data = snapshot.val() as StoreConfig | null
        // Cache the result
        cachedConfig = data
        return data
      })
      .catch((error) => {
        console.error('Error fetching config:', error)
        throw error
      })

    configPromise
      .then((data) => {
        if (mountedRef.current) {
          // Use startTransition to defer non-critical updates
          startTransition(() => {
            setConfig(data)
            setLoading(false)
            setError(null)
          })
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError('Failed to load config')
          setLoading(false)
        }
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { config, loading, error }
}
