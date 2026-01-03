'use client'

import { useState, useEffect } from 'react'
import styles from './admin.module.css'
import type { Product } from '@/lib/useFirebaseData'
import type { StoreConfig } from '@/lib/config'
import perfumesDataStatic from '@/data/perfumes.json'
import storeConfigStatic from '@/data/store-config.json'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'config'>('products')

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, configRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/config'),
      ])
      
      // Load products: Use Firebase if available, otherwise use static JSON
      let productsData: Product[] = []
      if (productsRes.ok) {
        const firebaseProducts = await productsRes.json()
        if (Array.isArray(firebaseProducts) && firebaseProducts.length > 0) {
          productsData = firebaseProducts
        } else {
          // If Firebase is empty, use static data
          productsData = perfumesDataStatic as Product[]
        }
      } else {
        // If Firebase fails, use static data
        productsData = perfumesDataStatic as Product[]
      }
      
      setProducts(productsData)
      
      // Load config: Use Firebase if available, otherwise use static JSON
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
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to static data on error
      setProducts(perfumesDataStatic as Product[])
      setConfig(storeConfigStatic as StoreConfig)
      setLoading(false)
    }
  }

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
          alert('✅ تم حفظ المنتجات بنجاح!')
        } else {
          alert('❌ حدث خطأ أثناء الحفظ')
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || 'حدث خطأ أثناء الحفظ'
        
        if (errorMessage.includes('Firebase not configured')) {
          alert('❌ خطأ: Firebase غير مُعدّ في Vercel.\n\nيرجى إضافة Environment Variables في Vercel:\n- اذهب إلى Project Settings → Environment Variables\n- أضف جميع متغيرات Firebase من .env.local')
        } else {
          alert(`❌ خطأ: ${errorMessage}`)
        }
      }
    } catch (error) {
      console.error('Error saving products:', error)
      alert('❌ حدث خطأ أثناء الحفظ. تحقق من Console للمزيد من التفاصيل.')
    } finally {
      setSaving(false)
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
          alert('✅ تم حفظ الإعدادات بنجاح!')
        } else {
          alert('❌ حدث خطأ أثناء الحفظ')
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || 'حدث خطأ أثناء الحفظ'
        
        if (errorMessage.includes('Firebase not configured')) {
          alert('❌ خطأ: Firebase غير مُعدّ في Vercel.\n\nيرجى إضافة Environment Variables في Vercel:\n- اذهب إلى Project Settings → Environment Variables\n- أضف جميع متغيرات Firebase من .env.local')
        } else {
          alert(`❌ خطأ: ${errorMessage}`)
        }
      }
    } catch (error) {
      console.error('Error saving config:', error)
      alert('❌ حدث خطأ أثناء الحفظ. تحقق من Console للمزيد من التفاصيل.')
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...products]
    updated[index] = { ...updated[index], [field]: value }
    setProducts(updated)
  }

  const updateProductSize = (productIndex: number, sizeIndex: number, field: 'size' | 'price', value: string | number) => {
    const updated = [...products]
    const sizes = [...updated[productIndex].sizes]
    sizes[sizeIndex] = { ...sizes[sizeIndex], [field]: value }
    updated[productIndex] = { ...updated[productIndex], sizes }
    setProducts(updated)
  }

  const addProductSize = (productIndex: number) => {
    const updated = [...products]
    updated[productIndex].sizes.push({ size: '', price: 0 })
    setProducts(updated)
  }

  const removeProductSize = (productIndex: number, sizeIndex: number) => {
    const updated = [...products]
    updated[productIndex].sizes = updated[productIndex].sizes.filter((_, i) => i !== sizeIndex)
    setProducts(updated)
  }

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: String(products.length + 1),
        name: '',
        description: '',
        image: '',
        sizes: [{ size: '', price: 0 }],
      },
    ])
  }

  const removeProduct = (index: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter((_, i) => i !== index))
    }
  }

  const updateConfig = (field: keyof StoreConfig, value: string) => {
    if (!config) return
    setConfig({ ...config, [field]: value })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>لوحة التحكم - Admin Panel</h1>
        <p className={styles.subtitle}>إدارة المنتجات وإعدادات المتجر</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          المنتجات ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`}
          onClick={() => setActiveTab('config')}
        >
          إعدادات المتجر
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>المنتجات</h2>
            <button onClick={addProduct} className={styles.addButton}>
              + إضافة منتج جديد
            </button>
          </div>

          {products.map((product, index) => (
            <div key={product.id || index} className={styles.productCard}>
              <div className={styles.productHeader}>
                <div>
                  <h3>منتج #{index + 1}</h3>
                  {product.name && (
                    <p className={styles.productNamePreview}>{product.name}</p>
                  )}
                </div>
                <button
                  onClick={() => removeProduct(index)}
                  className={styles.deleteButton}
                >
                  🗑️ حذف
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>اسم المنتج *</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  placeholder="اسم المنتج"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>الوصف *</label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct(index, 'description', e.target.value)}
                  placeholder="وصف المنتج"
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>مسار الصورة *</label>
                <input
                  type="text"
                  value={product.image}
                  onChange={(e) => updateProduct(index, 'image', e.target.value)}
                  placeholder="/images/Perfum_img(1).png"
                  className={styles.input}
                />
                <small className={styles.helpText}>
                  مثال: /images/Perfum_img(1).png
                </small>
              </div>

              <div className={styles.sizesSection}>
                <label>الأحجام والأسعار</label>
                {product.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className={styles.sizeRow}>
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => updateProductSize(index, sizeIndex, 'size', e.target.value)}
                      placeholder="30ml"
                      className={styles.sizeInput}
                    />
                    <input
                      type="number"
                      value={size.price}
                      onChange={(e) => updateProductSize(index, sizeIndex, 'price', Number(e.target.value))}
                      placeholder="السعر"
                      className={styles.priceInput}
                    />
                    <button
                      onClick={() => removeProductSize(index, sizeIndex)}
                      className={styles.removeSizeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addProductSize(index)}
                  className={styles.addSizeButton}
                >
                  + إضافة حجم
                </button>
              </div>
            </div>
          ))}

          <div className={styles.saveSection}>
            <button
              onClick={saveProducts}
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? '⏳ جاري الحفظ...' : '💾 حفظ جميع التغييرات'}
            </button>
            <p className={styles.saveHint}>
              💡 نصيحة: عدّل أي منتج في القائمة أعلاه ثم اضغط "حفظ جميع التغييرات"
            </p>
          </div>
        </section>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && config && (
        <section className={styles.section}>
          <h2>إعدادات المتجر</h2>

          <div className={styles.formGroup}>
            <label>اسم المتجر</label>
            <input
              type="text"
              value={config.storeName}
              onChange={(e) => updateConfig('storeName', e.target.value)}
              placeholder="اسم المتجر"
            />
          </div>

          <div className={styles.formGroup}>
            <label>رقم واتساب</label>
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={(e) => updateConfig('whatsappNumber', e.target.value)}
              placeholder="21626010403"
            />
          </div>

          <div className={styles.formGroup}>
            <label>رابط إنستغرام</label>
            <input
              type="text"
              value={config.instagram || ''}
              onChange={(e) => updateConfig('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>رابط فيسبوك</label>
            <input
              type="text"
              value={config.facebook || ''}
              onChange={(e) => updateConfig('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Google Analytics ID</label>
            <input
              type="text"
              value={config.googleAnalyticsId || ''}
              onChange={(e) => updateConfig('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className={styles.formGroup}>
            <label>رسالة واتساب العامة</label>
            <textarea
              value={config.generalWhatsAppMessage || ''}
              onChange={(e) => updateConfig('generalWhatsAppMessage', e.target.value)}
              placeholder="السلام عليكم، أريد الاستفسار عن العطور المتوفرة"
              rows={3}
            />
          </div>

          <button
            onClick={saveConfig}
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
          </button>
        </section>
      )}
    </div>
  )
}
