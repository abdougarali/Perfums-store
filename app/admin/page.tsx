'use client'

import { useState, useEffect, useMemo, useCallback, useRef, startTransition } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import styles from './admin.module.css'
import type { Product } from '@/lib/useFirebaseData'
import type { StoreConfig } from '@/lib/config'
import perfumesDataStatic from '@/data/perfumes.json'
import storeConfigStatic from '@/data/store-config.json'
import { simpleAuth } from '@/lib/simpleAuth'
import SimpleLogin from '@/components/SimpleLogin'

// Extended Product type with additional fields
interface ExtendedProduct extends Product {
  active?: boolean
  order?: number
  category?: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'config'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null) // product id being uploaded
  const [savingProductId, setSavingProductId] = useState<string | null>(null) // product id being saved
  const [showAddProductModal, setShowAddProductModal] = useState(false) // show add product modal
  const [newProduct, setNewProduct] = useState<ExtendedProduct | null>(null) // new product being created
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const ITEMS_PER_PAGE = 3

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  // Load data function
  const loadData = async () => {
    try {
      const [productsRes, configRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/config'),
      ])
      
      // Load products
      let productsData: ExtendedProduct[] = []
      if (productsRes.ok) {
        const firebaseProducts = await productsRes.json()
        if (Array.isArray(firebaseProducts) && firebaseProducts.length > 0) {
          productsData = firebaseProducts.map((p: Product, index: number) => ({
            ...p,
            active: (p as ExtendedProduct).active !== false, // default to true
            order: (p as ExtendedProduct).order ?? index,
            category: (p as ExtendedProduct).category || 'عام',
          }))
        } else {
          productsData = (perfumesDataStatic as Product[]).map((p, index) => ({
            ...p,
            active: true,
            order: index,
            category: 'عام',
          }))
        }
      } else {
        productsData = (perfumesDataStatic as Product[]).map((p, index) => ({
          ...p,
          active: true,
          order: index,
          category: 'عام',
        }))
      }
      
      // Sort by order
      productsData.sort((a, b) => (a.order || 0) - (b.order || 0))
      setProducts(productsData)
      
      // Load config
      if (configRes.ok) {
        const firebaseConfig = await configRes.json()
        if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
          setConfig(firebaseConfig)
        } else {
          setConfig(storeConfigStatic as StoreConfig)
        }
      } else {
        setConfig(storeConfigStatic as StoreConfig)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setProducts((perfumesDataStatic as Product[]).map((p, index) => ({
        ...p,
        active: true,
        order: index,
        category: 'عام',
      })) as ExtendedProduct[])
      setConfig(storeConfigStatic as StoreConfig)
    } finally {
      setLoading(false)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(simpleAuth.isAuthenticated())
    if (simpleAuth.isAuthenticated()) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  // Handle logout
  const handleLogout = useCallback(() => {
    simpleAuth.logout()
    setIsAuthenticated(false)
    showToast('تم تسجيل الخروج بنجاح', 'success')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }, [])

  // Helper function to calculate Base64 image size
  const getImageSize = (imageString: string): { sizeKB: number; sizeMB: number; isBase64: boolean } => {
    if (!imageString) return { sizeKB: 0, sizeMB: 0, isBase64: false }
    
    if (imageString.startsWith('data:')) {
      // Base64 image: calculate size from base64 string
      const base64String = imageString.split(',')[1] || ''
      const sizeInBytes = (base64String.length * 3) / 4
      const sizeKB = sizeInBytes / 1024
      const sizeMB = sizeKB / 1024
      return { sizeKB, sizeMB, isBase64: true }
    }
    
    return { sizeKB: 0, sizeMB: 0, isBase64: false }
  }


  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, filterActive])

  const saveProducts = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          showToast('✅ تم حفظ جميع المنتجات بنجاح!', 'success')
        } else {
          showToast('❌ حدث خطأ أثناء الحفظ', 'error')
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || 'حدث خطأ أثناء الحفظ'
        
        if (errorMessage.includes('Firebase not configured')) {
          showToast('❌ Firebase غير مُعدّ في Vercel. راجع VERCEL_ENV_SETUP.md', 'error')
        } else {
          showToast(`❌ ${errorMessage}`, 'error')
        }
      }
    } catch (error) {
      console.error('Error saving products:', error)
      showToast('❌ حدث خطأ أثناء الحفظ. تحقق من Console', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveSingleProduct = async (productIndex: number) => {
    const product = products[productIndex]
    setSavingProductId(product.id)
    
    try {
      // Save the entire products array (Firebase stores the full array)
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          showToast(`✅ تم حفظ "${product.name || 'المنتج'}" بنجاح!`, 'success')
        } else {
          showToast('❌ حدث خطأ أثناء الحفظ', 'error')
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || 'حدث خطأ أثناء الحفظ'
        
        if (errorMessage.includes('Firebase not configured')) {
          showToast('❌ Firebase غير مُعدّ في Vercel. راجع VERCEL_ENV_SETUP.md', 'error')
        } else {
          showToast(`❌ ${errorMessage}`, 'error')
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showToast('❌ حدث خطأ أثناء الحفظ. تحقق من Console', 'error')
    } finally {
      setSavingProductId(null)
    }
  }

  const saveConfig = async () => {
    if (!config) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          showToast('✅ تم حفظ الإعدادات بنجاح!', 'success')
        } else {
          showToast('❌ حدث خطأ أثناء الحفظ', 'error')
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || 'حدث خطأ أثناء الحفظ'
        
        if (errorMessage.includes('Firebase not configured')) {
          showToast('❌ Firebase غير مُعدّ في Vercel. راجع VERCEL_ENV_SETUP.md', 'error')
        } else {
          showToast(`❌ ${errorMessage}`, 'error')
        }
      }
    } catch (error) {
      console.error('Error saving config:', error)
      showToast('❌ حدث خطأ أثناء الحفظ. تحقق من Console', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = useCallback((index: number, field: keyof ExtendedProduct, value: any) => {
    setProducts(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const updateProductSize = useCallback((productIndex: number, sizeIndex: number, field: 'size' | 'price', value: string | number) => {
    setProducts(prev => {
      const updated = [...prev]
      const sizes = [...updated[productIndex].sizes]
      sizes[sizeIndex] = { ...sizes[sizeIndex], [field]: value }
      updated[productIndex] = { ...updated[productIndex], sizes }
      return updated
    })
  }, [])

  const addProductSize = useCallback((productIndex: number) => {
    setProducts(prev => {
      const updated = [...prev]
      updated[productIndex].sizes.push({ size: '', price: 0 })
      return updated
    })
  }, [])

  const removeProductSize = useCallback((productIndex: number, sizeIndex: number) => {
    setProducts(prev => {
      const updated = [...prev]
      updated[productIndex].sizes = updated[productIndex].sizes.filter((_, i) => i !== sizeIndex)
      return updated
    })
  }, [])

  const addProduct = useCallback(() => {
    // Open modal with empty product form
    const product: ExtendedProduct = {
      id: String(Date.now()),
      name: '',
      description: '',
      image: '',
      sizes: [{ size: '', price: 0 }],
      active: true,
      order: products.length,
      category: 'عام',
    }
    setNewProduct(product)
    setShowAddProductModal(true)
  }, [products.length])

  const handleSaveNewProduct = () => {
    if (!newProduct) return

    // Validate required fields
    if (!newProduct.name.trim()) {
      showToast('❌ يرجى إدخال اسم المنتج', 'error')
      return
    }
    if (!newProduct.image.trim()) {
      showToast('❌ يرجى إدخال صورة المنتج', 'error')
      return
    }
    if (newProduct.sizes.length === 0 || !newProduct.sizes[0].size.trim() || newProduct.sizes[0].price <= 0) {
      showToast('❌ يرجى إدخال حجم واحد على الأقل بسعر صحيح', 'error')
      return
    }

    // Add product to list
    setProducts([...products, newProduct])
    setShowAddProductModal(false)
    setNewProduct(null)
    setActiveTab('products')
    showToast('✅ تم إضافة المنتج بنجاح', 'success')
    
    // Scroll to new product after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`product-${newProduct.id}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleCancelNewProduct = () => {
    setShowAddProductModal(false)
    setNewProduct(null)
  }

  const removeProduct = useCallback((index: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(prev => prev.filter((_, i) => i !== index))
      showToast('تم حذف المنتج', 'success')
    }
  }, [])

  const toggleProductActive = useCallback((index: number) => {
    console.log('[toggleProductActive] Toggling product at index:', index)
    setProducts(prev => {
      if (index < 0 || index >= prev.length) {
        console.error('[toggleProductActive] Invalid index:', index, 'Products length:', prev.length)
        return prev
      }
      
      // Create a completely new array with new objects to ensure React detects the change
      const updated = prev.map((p, i) => {
        if (i === index) {
          const currentActive = p.active !== false // true if active is true or undefined
          const newActive = !currentActive
          console.log('[toggleProductActive] Before toggle - active:', p.active, 'product id:', p.id, 'newActive:', newActive)
          // Return a completely new object
          return { ...p, active: newActive }
        }
        return p
      })
      
      console.log('[toggleProductActive] After toggle - updated product active:', updated[index].active)
      console.log('[toggleProductActive] Full updated array length:', updated.length)
      return updated
    })
  }, [])

  const moveProduct = useCallback((index: number, direction: 'up' | 'down') => {
    setProducts(prev => {
      const updated = [...prev]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      if (newIndex < 0 || newIndex >= updated.length) return prev
      
      // Swap orders
      const tempOrder = updated[index].order || index
      updated[index].order = updated[newIndex].order || newIndex
      updated[newIndex].order = tempOrder
      
      // Swap products
      const temp = updated[index]
      updated[index] = updated[newIndex]
      updated[newIndex] = temp
      
      return updated
    })
  }, [])

  const updateConfig = useCallback((field: keyof StoreConfig, value: string) => {
    if (!config) return
    setConfig(prev => prev ? { ...prev, [field]: value } : null)
  }, [config])

  const handleImageUpload = async (productIndex: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('❌ الملف يجب أن يكون صورة', 'error')
      return
    }

    const product = products[productIndex]
    setUploadingImage(product.id)

    try {
      // Compress image before uploading
      const originalSize = file.size
      console.log('Compressing image...', {
        fileName: file.name,
        originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`
      })

      // Check if browser supports WebP
      const supportsWebP = typeof document !== 'undefined' && 
        document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
      
      const compressionOptions = {
        maxSizeMB: 0.25, // Maximum file size in MB (250KB) - optimized for performance
        maxWidthOrHeight: 600, // Maximum width or height in pixels - optimized for web
        useWebWorker: true, // Use web worker for better performance
        // Convert to WebP if supported (25-35% smaller than JPG/PNG)
        fileType: supportsWebP ? 'image/webp' : file.type,
        initialQuality: 0.75, // 75% quality for WebP (optimal balance between size and quality)
      }

      let compressedFile: File
      try {
        compressedFile = await imageCompression(file, compressionOptions)
        const reduction = ((1 - compressedFile.size / originalSize) * 100).toFixed(1)
        console.log('Image compressed:', {
          originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
          compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
          reduction: `${reduction}%`
        })
        showToast(`📦 جاري ضغط الصورة... (تم تقليل ${reduction}%)`, 'success')
      } catch (compressionError) {
        console.warn('Compression failed, using original file:', compressionError)
        compressedFile = file
      }

      const formData = new FormData()
      formData.append('file', compressedFile)

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        updateProduct(productIndex, 'image', data.url)
        showToast('✅ تم رفع الصورة بنجاح', 'success')
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }))
        const errorMessage = errorData.details 
          ? `${errorData.error}\n${errorData.details}` 
          : errorData.error || 'فشل رفع الصورة'
        console.error('Upload error:', errorData)
        showToast(`❌ ${errorMessage}`, 'error')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('❌ حدث خطأ أثناء رفع الصورة', 'error')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleImageUploadNewProduct = async (file: File) => {
    if (!newProduct) return
    if (!file.type.startsWith('image/')) {
      showToast('❌ الملف يجب أن يكون صورة', 'error')
      return
    }

    setUploadingImage('new-product')

    try {
      // Compress image before uploading
      const originalSize = file.size
      console.log('Compressing image...', {
        fileName: file.name,
        originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`
      })

      // Check if browser supports WebP
      const supportsWebP = typeof document !== 'undefined' && 
        document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
      
      const compressionOptions = {
        maxSizeMB: 0.25, // Maximum file size in MB (250KB) - optimized for performance
        maxWidthOrHeight: 600, // Maximum width or height in pixels - optimized for web
        useWebWorker: true, // Use web worker for better performance
        // Convert to WebP if supported (25-35% smaller than JPG/PNG)
        fileType: supportsWebP ? 'image/webp' : file.type,
        initialQuality: 0.75, // 75% quality for WebP (optimal balance between size and quality)
      }

      let compressedFile: File
      try {
        compressedFile = await imageCompression(file, compressionOptions)
        const reduction = ((1 - compressedFile.size / originalSize) * 100).toFixed(1)
        console.log('Image compressed:', {
          originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
          compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
          reduction: `${reduction}%`
        })
        showToast(`📦 جاري ضغط الصورة... (تم تقليل ${reduction}%)`, 'success')
      } catch (compressionError) {
        console.warn('Compression failed, using original file:', compressionError)
        compressedFile = file
      }

      const formData = new FormData()
      formData.append('file', compressedFile)

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setNewProduct({ ...newProduct, image: data.url })
        showToast('✅ تم رفع الصورة بنجاح', 'success')
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }))
        const errorMessage = errorData.details 
          ? `${errorData.error}\n${errorData.details}` 
          : errorData.error || 'فشل رفع الصورة'
        console.error('Upload error:', errorData)
        showToast(`❌ ${errorMessage}`, 'error')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('❌ حدث خطأ أثناء رفع الصورة', 'error')
    } finally {
      setUploadingImage(null)
    }
  }

  const updateNewProduct = (field: keyof ExtendedProduct, value: any) => {
    if (!newProduct) return
    setNewProduct({ ...newProduct, [field]: value })
  }

  const updateNewProductSize = (sizeIndex: number, field: 'size' | 'price', value: string | number) => {
    if (!newProduct) return
    const sizes = [...newProduct.sizes]
    sizes[sizeIndex] = { ...sizes[sizeIndex], [field]: value }
    setNewProduct({ ...newProduct, sizes })
  }

  const addNewProductSize = () => {
    if (!newProduct) return
    setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, { size: '', price: 0 }] })
  }

  const removeNewProductSize = (sizeIndex: number) => {
    if (!newProduct) return
    setNewProduct({ ...newProduct, sizes: newProduct.sizes.filter((_, i) => i !== sizeIndex) })
  }

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by active status
    if (filterActive === 'active') {
      filtered = filtered.filter(p => p.active !== false)
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(p => p.active === false)
    }

    // Search (using debounced query)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, debouncedSearchQuery, filterActive])

  // Pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return {
      totalPages,
      startIndex,
      endIndex,
      paginatedProducts
    }
  }, [filteredProducts, currentPage, ITEMS_PER_PAGE])

  const { totalPages, startIndex, endIndex, paginatedProducts } = paginationData

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll to top of products list
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev > 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return prev - 1
      }
      return prev
    })
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev < totalPages) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return prev + 1
      }
      return prev
    })
  }, [totalPages])

  // Statistics
  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter(p => p.active !== false).length
    const inactive = total - active
    const totalSizes = products.reduce((sum, p) => sum + p.sizes.length, 0)
    
    return { total, active, inactive, totalSizes }
  }, [products])

  // Show login if not authenticated
  if (!isAuthenticated && !loading) {
    return <SimpleLogin />
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1>لوحة التحكم</h1>
          <p className={styles.subtitle}>إدارة متجر العطور بسهولة واحترافية</p>
        </div>
        <div className={styles.headerActions}>
          <a href="/" target="_blank" className={styles.viewSiteButton}>
            👁️ عرض الموقع
          </a>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 لوحة المعلومات
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ المنتجات ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`}
          onClick={() => setActiveTab('config')}
        >
          ⚙️ الإعدادات
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>لوحة المعلومات</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8H20V18Z" fill="currentColor"/>
                  <path d="M6 10H18V12H6V10ZM6 14H14V16H6V14Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>{stats.total}</h3>
                <p>إجمالي المنتجات</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>{stats.active}</h3>
                <p>منتجات نشطة</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19H18V17H6V19ZM6 15H18V13H6V15ZM6 11H18V9H6V11ZM6 7H18V5H6V7Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>{stats.inactive}</h3>
                <p>منتجات غير نشطة</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>{stats.totalSizes}</h3>
                <p>إجمالي الأحجام</p>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>إجراءات سريعة</h3>
            <div className={styles.quickActionsGrid}>
              <button onClick={addProduct} className={styles.quickActionButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>إضافة منتج جديد</span>
              </button>
              <button onClick={() => setActiveTab('products')} className={styles.quickActionButton}>
                📝 تعديل المنتجات
              </button>
              <button onClick={() => setActiveTab('config')} className={styles.quickActionButton}>
                ⚙️ تعديل الإعدادات
              </button>
              <a href="/" target="_blank" className={styles.quickActionButton}>
                👁️ معاينة الموقع
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>إدارة المنتجات</h2>
            <button onClick={addProduct} className={styles.addButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className={styles.searchFilterBar}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
              </svg>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => {
                  startTransition(() => {
                    setSearchQuery(e.target.value)
                  })
                }}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${filterActive === 'all' ? styles.active : ''}`}
                onClick={() => setFilterActive('all')}
              >
                الكل ({products.length})
              </button>
              <button
                className={`${styles.filterButton} ${filterActive === 'active' ? styles.active : ''}`}
                onClick={() => setFilterActive('active')}
              >
                نشط ({stats.active})
              </button>
              <button
                className={`${styles.filterButton} ${filterActive === 'inactive' ? styles.active : ''}`}
                onClick={() => setFilterActive('inactive')}
              >
                غير نشط ({stats.inactive})
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className={styles.productsList}>
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>🔍 لا توجد منتجات تطابق البحث</p>
              </div>
            ) : (
              <>
                {/* Products Count Info */}
                {filteredProducts.length > 0 && (
                  <div className={styles.paginationInfo}>
                    <p>
                      عرض {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} من {filteredProducts.length} منتج
                    </p>
                  </div>
                )}

                {/* Paginated Products */}
                {paginatedProducts.map((product, index) => {
                const originalIndex = products.findIndex(p => p.id === product.id)
                // Get the actual product from the products array to ensure we have the latest state
                const actualProduct = originalIndex >= 0 ? products[originalIndex] : product
                // Use a key that includes the active state to force re-render when it changes
                const productKey = `${product.id}-${actualProduct.active !== false ? 'active' : 'inactive'}`
                return (
                  <div key={productKey} id={`product-${product.id}`} className={styles.productCard}>
                    <div className={styles.productCardHeader}>
                      <div className={styles.productCardHeaderLeft}>
                        <div className={styles.productOrderControls}>
                          <button
                            onClick={() => moveProduct(originalIndex, 'up')}
                            disabled={originalIndex === 0}
                            className={styles.orderButton}
                            title="نقل للأعلى"
                          >
                            ⬆️
                          </button>
                          <button
                            onClick={() => moveProduct(originalIndex, 'down')}
                            disabled={originalIndex === products.length - 1}
                            className={styles.orderButton}
                            title="نقل للأسفل"
                          >
                            ⬇️
                          </button>
                        </div>
                        <div>
                          <h3 className={styles.productCardTitle}>
                            منتج #{originalIndex + 1}
                            {product.name && <span className={styles.productNameBadge}>{product.name}</span>}
                          </h3>
                          <div className={styles.productMeta}>
                            <span className={styles.productId}>ID: {product.id}</span>
                            <span className={styles.productOrder}>ترتيب: {product.order ?? originalIndex}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.productCardHeaderRight}>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={actualProduct.active !== false}
                            onChange={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('[Checkbox] onChange triggered for product:', actualProduct.id, 'originalIndex:', originalIndex, 'current active:', actualProduct.active)
                              if (originalIndex >= 0) {
                                toggleProductActive(originalIndex)
                              } else {
                                console.error('[Checkbox] Invalid originalIndex:', originalIndex)
                              }
                            }}
                          />
                          <span className={styles.toggleSlider}></span>
                          <span className={styles.toggleLabel}>
                            {actualProduct.active !== false ? 'نشط' : 'غير نشط'}
                          </span>
                        </label>
                        <button
                          onClick={() => removeProduct(originalIndex)}
                          className={styles.deleteButton}
                          title="حذف المنتج"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className={styles.productCardBody}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>اسم المنتج *</label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(originalIndex, 'name', e.target.value)}
                            placeholder="اسم المنتج"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label>التصنيف</label>
                          <input
                            type="text"
                            value={product.category || ''}
                            onChange={(e) => updateProduct(originalIndex, 'category', e.target.value)}
                            placeholder="عام"
                            className={styles.input}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>الوصف *</label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(originalIndex, 'description', e.target.value)}
                          placeholder="وصف المنتج"
                          rows={3}
                          className={styles.textarea}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>الصورة *</label>
                        <div className={styles.imageUploadSection}>
                          <div className={styles.imagePreviewContainer}>
                            {product.image ? (
                              <div className={styles.imagePreview}>
                                <Image
                                  src={product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/${product.image}`}
                                  alt={product.name || 'Product'}
                                  fill
                                  className={styles.previewImage}
                                  unoptimized={product.image.startsWith('data:')}
                                  sizes="120px"
                                  loading="lazy"
                                  quality={85}
                                />
                                <button
                                  onClick={() => updateProduct(originalIndex, 'image', '')}
                                  className={styles.removeImageButton}
                                  title="إزالة الصورة"
                                >
                                  ✕
                                </button>
                                {/* Image size indicator */}
                                {(() => {
                                  const imageSize = getImageSize(product.image)
                                  if (imageSize.isBase64) {
                                    const isLarge = imageSize.sizeKB > 250
                                    return (
                                      <div className={`${styles.imageSizeBadge} ${isLarge ? styles.imageSizeLarge : styles.imageSizeGood}`}>
                                        {imageSize.sizeMB > 1 
                                          ? `${imageSize.sizeMB.toFixed(2)} MB`
                                          : `${imageSize.sizeKB.toFixed(0)} KB`
                                        }
                                        {isLarge && <span className={styles.imageSizeWarning}> ⚠️ كبير</span>}
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                              </div>
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                <span>📷</span>
                                <p>لا توجد صورة</p>
                              </div>
                            )}
                          </div>
                          <div className={styles.imageUploadControls}>
                            <input
                              type="text"
                              value={product.image}
                              onChange={(e) => updateProduct(originalIndex, 'image', e.target.value)}
                              placeholder="/images/Perfum_img(1).png أو رابط Firebase"
                              className={styles.input}
                            />
                            <label className={styles.uploadButton}>
                              {uploadingImage === product.id ? (
                                <>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" opacity="0.3"/>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="23.562">
                                      <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                                    </circle>
                                  </svg>
                                  <span>جاري الرفع...</span>
                                </>
                              ) : (
                                <>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 18C4.23858 18 2 15.7614 2 13C2 10.2386 4.23858 8 7 8C7.33514 8 7.66082 8.03173 7.97561 8.09181C8.46364 5.28056 10.8638 3.25 13.5 3.25C16.4645 3.25 18.75 5.53553 18.75 8.5C18.75 8.69891 18.7402 8.89539 18.7209 9.08911C20.3933 9.34922 21.75 10.8462 21.75 12.75C21.75 14.8211 20.0711 16.5 18 16.5H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 8V16M8 12L12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span>رفع صورة</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(originalIndex, file)
                                }}
                                disabled={uploadingImage === product.id}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>
                          <small className={styles.helpText}>
                            يمكنك إدخال مسار الصورة أو رفع صورة جديدة إلى Firebase
                          </small>
                        </div>
                      </div>

                      <div className={styles.sizesSection}>
                        <div className={styles.sizesSectionHeader}>
                          <label>الأحجام والأسعار</label>
                          <button
                            onClick={() => addProductSize(originalIndex)}
                            className={styles.addSizeButton}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>إضافة حجم</span>
                          </button>
                        </div>
                        <div className={styles.sizesList}>
                          {product.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className={styles.sizeRow}>
                              <input
                                type="text"
                                value={size.size}
                                onChange={(e) => updateProductSize(originalIndex, sizeIndex, 'size', e.target.value)}
                                placeholder="30ml"
                                className={styles.sizeInput}
                              />
                              <input
                                type="number"
                                value={size.price}
                                onChange={(e) => updateProductSize(originalIndex, sizeIndex, 'price', Number(e.target.value))}
                                placeholder="السعر"
                                className={styles.priceInput}
                                min="0"
                                step="0.01"
                              />
                              <span className={styles.currency}>د.ت</span>
                              <button
                                onClick={() => removeProductSize(originalIndex, sizeIndex)}
                                className={styles.removeSizeButton}
                                title="حذف الحجم"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Button for this product */}
                      <div className={styles.productSaveSection}>
                        <button
                          onClick={() => saveSingleProduct(originalIndex)}
                          disabled={savingProductId === product.id}
                          className={styles.saveProductButton}
                        >
                          {savingProductId === product.id ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" opacity="0.3"/>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="23.562">
                                  <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                                </circle>
                              </svg>
                              <span>جاري الحفظ...</span>
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 3V8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>حفظ التغييرات</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                      aria-label="الصفحة السابقة"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>السابق</span>
                    </button>

                    <div className={styles.paginationNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)

                        if (!showPage) {
                          // Show ellipsis
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className={styles.paginationEllipsis}>
                                ...
                              </span>
                            )
                          }
                          return null
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ''}`}
                            aria-label={`الصفحة ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                      aria-label="الصفحة التالية"
                    >
                      <span>التالي</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {filteredProducts.length > 0 && (
            <div className={styles.saveSection}>
              <button
                onClick={saveProducts}
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 3V8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 13H15M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>حفظ جميع التغييرات</span>
                  </>
                )}
              </button>
              <p className={styles.saveHint}>
                💡 نصيحة: بعد تعديل أي منتج، اضغط &quot;حفظ جميع التغييرات&quot; لتطبيق التعديلات
              </p>
            </div>
          )}
        </section>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && config && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>إعدادات المتجر</h2>

          <div className={styles.configGrid}>
            <div className={styles.formGroup}>
              <label>اسم المتجر *</label>
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => updateConfig('storeName', e.target.value)}
                placeholder="اسم المتجر"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>رقم واتساب *</label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => updateConfig('whatsappNumber', e.target.value)}
                placeholder="21626010403"
                className={styles.input}
              />
              <small className={styles.helpText}>رقم واتساب بدون + أو مسافات</small>
            </div>

            <div className={styles.formGroup}>
              <label>رابط إنستغرام</label>
              <input
                type="url"
                value={config.instagram || ''}
                onChange={(e) => updateConfig('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>رابط فيسبوك</label>
              <input
                type="url"
                value={config.facebook || ''}
                onChange={(e) => updateConfig('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Google Analytics ID</label>
              <input
                type="text"
                value={config.googleAnalyticsId || ''}
                onChange={(e) => updateConfig('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className={styles.input}
              />
              <small className={styles.helpText}>معرف Google Analytics (اختياري)</small>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>رسالة واتساب العامة</label>
              <textarea
                value={config.generalWhatsAppMessage || ''}
                onChange={(e) => updateConfig('generalWhatsAppMessage', e.target.value)}
                placeholder="السلام عليكم، أريد الاستفسار عن العطور المتوفرة"
                rows={4}
                className={styles.textarea}
              />
              <small className={styles.helpText}>الرسالة الافتراضية عند الضغط على زر واتساب</small>
            </div>
          </div>

          <button
            onClick={saveConfig}
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12V7H5V12M19 12L17 14H7L5 12M19 12H21M5 12H3M17 14V19H7V14M17 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L9 19M15 12V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>حفظ الإعدادات</span>
              </>
            )}
          </button>
        </section>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && newProduct && (
        <div className={styles.modalOverlay} onClick={handleCancelNewProduct}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>إضافة منتج جديد</h2>
              <button onClick={handleCancelNewProduct} className={styles.modalCloseButton}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>اسم المنتج *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => updateNewProduct('name', e.target.value)}
                  placeholder="عطر الكلاسيكية"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>الوصف</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => updateNewProduct('description', e.target.value)}
                  placeholder="وصف المنتج..."
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>الصورة *</label>
                <div className={styles.imageUploadSection}>
                  <div className={styles.imagePreviewContainer}>
                    {newProduct.image ? (
                      <div className={styles.imagePreview}>
                        <Image
                          src={newProduct.image.startsWith('data:') || newProduct.image.startsWith('http') || newProduct.image.startsWith('/') ? newProduct.image : `/${newProduct.image}`}
                          alt={newProduct.name || 'Product'}
                          fill
                          className={styles.previewImage}
                          unoptimized={newProduct.image.startsWith('data:')}
                          sizes="120px"
                          loading="lazy"
                          quality={85}
                        />
                        <button
                          onClick={() => updateNewProduct('image', '')}
                          className={styles.removeImageButton}
                          title="إزالة الصورة"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span>📷</span>
                        <p>لا توجد صورة</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.imageUploadControls}>
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={(e) => updateNewProduct('image', e.target.value)}
                      placeholder="/images/Perfum_img(1).png أو رابط Firebase"
                      className={styles.input}
                    />
                    <label className={styles.uploadButton}>
                      {uploadingImage === 'new-product' ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" opacity="0.3"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="23.562">
                              <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                            </circle>
                          </svg>
                          <span>جاري الرفع...</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 18C4.23858 18 2 15.7614 2 13C2 10.2386 4.23858 8 7 8C7.33514 8 7.66082 8.03173 7.97561 8.09181C8.46364 5.28056 10.8638 3.25 13.5 3.25C16.4645 3.25 18.75 5.53553 18.75 8.5C18.75 8.69891 18.7402 8.89539 18.7209 9.08911C20.3933 9.34922 21.75 10.8462 21.75 12.75C21.75 14.8211 20.0711 16.5 18 16.5H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8V16M8 12L12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>رفع صورة</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUploadNewProduct(file)
                        }}
                        disabled={uploadingImage === 'new-product'}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.sizesSection}>
                <div className={styles.sizesSectionHeader}>
                  <label>الأحجام والأسعار *</label>
                  <button
                    onClick={addNewProductSize}
                    className={styles.addSizeButton}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>إضافة حجم</span>
                  </button>
                </div>
                <div className={styles.sizesList}>
                  {newProduct.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className={styles.sizeRow}>
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => updateNewProductSize(sizeIndex, 'size', e.target.value)}
                        placeholder="30ml"
                        className={styles.sizeInput}
                      />
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) => updateNewProductSize(sizeIndex, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="السعر"
                        className={styles.priceInput}
                        min="0"
                        step="0.01"
                      />
                      {newProduct.sizes.length > 1 && (
                        <button
                          onClick={() => removeNewProductSize(sizeIndex)}
                          className={styles.removeSizeButton}
                          title="حذف الحجم"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={handleCancelNewProduct} className={styles.cancelButton}>
                إلغاء
              </button>
              <button onClick={handleSaveNewProduct} className={styles.saveButton}>
                حفظ المنتج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
