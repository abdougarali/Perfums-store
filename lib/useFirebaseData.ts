'use client'

import { useState, useEffect, useRef } from 'react'
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

// Cache Firebase data in memory to avoid redundant requests
let cachedProducts: Product[] | null = null
let cachedConfig: StoreConfig | null = null

// Function to clear cache (useful for forcing refresh)
export function clearProductsCache() {
  cachedProducts = null
}

export function clearConfigCache() {
  cachedConfig = null
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Reset mounted flag when effect runs
    mountedRef.current = true
    
    console.log('[useProducts] useEffect running...')
    console.log('[useProducts] Firebase API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
    console.log('[useProducts] db exists:', !!db)
    
    // Check if Firebase is configured and available
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.error('[useProducts] Firebase API Key not found!')
      setError('Firebase not configured')
      setLoading(false)
      return
    }
    
    if (!db) {
      console.error('[useProducts] Firebase db is null! Trying to initialize...')
      // Try to get db from firebase module
      import('./firebase').then(({ db: dbInstance }) => {
        if (dbInstance && mountedRef.current) {
          console.log('[useProducts] Got db instance, setting up listener...')
          setupListener(dbInstance)
        } else {
          console.error('[useProducts] db is still null after import')
          if (mountedRef.current) {
            setError('Firebase database not available')
            setLoading(false)
          }
        }
      })
      return
    }

    let unsubscribe: (() => void) | null = null

    function setupListener(database: typeof db) {
      if (!database) {
        console.error('[useProducts] Database is null in setupListener')
        return
      }

      // Return cached data immediately if available (for instant initial render)
      if (cachedProducts && mountedRef.current) {
        console.log('[useProducts] Using cached products:', cachedProducts.length)
        setProducts(cachedProducts)
        setLoading(false)
      }

      // Set up real-time listener for live updates
      const productsRef = ref(database, 'products')
      console.log('[useProducts] Setting up Firebase listener on path: products')
      console.log('[useProducts] Database URL:', database.app.options.databaseURL)
      
      // onValue fires immediately with current data, then on every change
      unsubscribe = onValue(
        productsRef,
        (snapshot) => {
          console.log('[useProducts] ⚡ LISTENER FIRED! Snapshot exists:', !!snapshot, 'Mounted:', mountedRef.current)
          
          // Always process the data, even if component seems unmounted (React Strict Mode issue)
          const data = snapshot.val()
          console.log('[useProducts] Firebase data changed:', data ? `Received ${Array.isArray(data) ? data.length : Object.keys(data).length} products` : 'No data')
          console.log('[useProducts] Raw data type:', typeof data, Array.isArray(data) ? 'Array' : data ? 'Object' : 'null')
          
          let productsArray: Product[] = []
          if (data) {
            // Convert object to array if needed - always create new array reference
            if (Array.isArray(data)) {
              productsArray = [...data] // Create new array copy
            } else {
              // Firebase might store as object with numeric keys
              productsArray = Object.values(data) as Product[]
              // Ensure it's a proper array with all items
              productsArray = productsArray.filter(p => p !== null && p !== undefined)
            }
          }
          
          console.log('[useProducts] Processed products array:', productsArray.length, 'items')
          
          // Always create a deep copy to ensure React detects the change
          const newProductsArray = productsArray.map(p => ({ ...p }))
          
          // Update cache
          cachedProducts = newProductsArray
          
          // Update state only if component is still mounted
          if (mountedRef.current) {
            console.log('[useProducts] Updating state with', newProductsArray.length, 'products')
            // Update immediately (don't defer - this is important data)
            setProducts(newProductsArray)
            setLoading(false)
            setError(null)
          } else {
            console.log('[useProducts] Component unmounted, but data received:', newProductsArray.length, 'products')
          }
        },
        (error) => {
          console.error('[useProducts] Error in listener:', error)
          if (mountedRef.current) {
            setError('Failed to load products')
            setLoading(false)
          }
        }
      )
    }

    if (db) {
      setupListener(db)
    }

    return () => {
      console.log('[useProducts] Cleaning up listener...')
      mountedRef.current = false
      if (unsubscribe) {
        unsubscribe()
      }
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

    // Return cached data immediately if available (for instant initial render)
    if (cachedConfig) {
      setConfig(cachedConfig)
      setLoading(false)
    }

    // Set up real-time listener for live updates
    const configRef = ref(db, 'config')
    const unsubscribe = onValue(
      configRef,
      (snapshot) => {
        if (!mountedRef.current) return

        const data = snapshot.val() as StoreConfig | null
        
        // Update cache
        cachedConfig = data
        
        // Update immediately (don't defer - this is important data)
        setConfig(data)
        setLoading(false)
        setError(null)
      },
      (error) => {
        if (mountedRef.current) {
          console.error('Error fetching config:', error)
          setError('Failed to load config')
          setLoading(false)
        }
      }
    )

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [])

  return { config, loading, error }
}
