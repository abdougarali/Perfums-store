# 🔥 خطة بناء Admin Panel مع Firebase

## 📋 نظرة عامة

هذه خطة مفصلة خطوة بخطوة لبناء Admin Panel بسيط ومعزول باستخدام Firebase.

---

## 🎯 الهدف النهائي

- ✅ صفحة `/admin` معزولة (غير ظاهرة في الموقع)
- ✅ تعديل المنتجات (perfumes)
- ✅ تعديل إعدادات المتجر (store-config)
- ✅ رفع صور جديدة (اختياري)
- ✅ بدون Auth (لكن الرابط مخفي)

---

## 📦 الخطوة 1: إعداد Firebase (10 دقائق)

### 1.1 إنشاء حساب Firebase
1. اذهب إلى: https://console.firebase.google.com/
2. اضغط **Add project** (أو استخدم مشروع موجود)
3. أدخل اسم المشروع: `perfume-store-admin`
4. اضغط **Continue**

### 1.2 تفعيل Realtime Database
1. في Firebase Console، اذهب إلى **Build** → **Realtime Database**
2. اضغط **Create Database**
3. اختر **Start in test mode** (للتطوير)
4. اختر Location: **us-central1** (أو الأقرب لك)
5. اضغط **Enable**

### 1.3 تفعيل Storage (للصور) - اختياري
**ملاحظة**: Storage اختياري. إذا كنت تريد فقط تعديل البيانات (بدون رفع صور جديدة)، يمكنك تخطي هذه الخطوة.

**الطريقة 1: من القائمة الرئيسية**
1. اذهب إلى **Build** → **Storage** (من القائمة الجانبية)
2. إذا كانت Storage غير مفعّلة، ستجد زر **Get started** أو **Create bucket**
3. اضغط على الزر
4. اختر Location: **us-central1** (أو الأقرب لك)
5. اضغط **Next** → **Done**

**الطريقة 2: إذا لم تجد "Get started"**
1. اذهب إلى **Build** → **Storage**
2. إذا كانت Storage مفعّلة بالفعل، ستجد قائمة الملفات
3. إذا لم تكن مفعّلة، ابحث عن زر **Create bucket** أو **Enable Storage**
4. اتبع التعليمات على الشاشة

**الطريقة 3: من Project Settings**
1. اذهب إلى **⚙️ Project Settings** → **General**
2. ابحث عن قسم **Storage**
3. إذا كانت غير مفعّلة، اضغط **Enable Storage**
4. اتبع التعليمات

⚠️ **ملاحظة**: في بعض الحالات، Storage قد تكون مفعّلة تلقائياً أو قد تحتاج إلى تفعيلها من Cloud Console.

### 1.4 الحصول على Firebase Config
1. اذهب إلى **Project Settings** (⚙️)
2. في قسم **Your apps**، اضغط **Web** (</>)
3. سجّل اسم App: `perfume-store-web`
4. انسخ **Firebase Config** (سيحتاجها لاحقاً)

```javascript
// ستحصل على شيء مثل:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "perfume-store.firebaseapp.com",
  databaseURL: "https://perfume-store-default-rtdb.firebaseio.com",
  projectId: "perfume-store",
  storageBucket: "perfume-store.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

### 1.5 تحديث قواعد الأمان (Security Rules)
1. في **Realtime Database** → **Rules**
2. غيّر القواعد إلى:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ **ملاحظة**: هذا للاختبار فقط. في Production، استخدم قواعد أكثر أماناً.

3. في **Storage** → **Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📦 الخطوة 2: تثبيت Firebase SDK (2 دقيقة)

```bash
cd "C:\Users\ASUS\Desktop\Fragrance Libraries\perfume-store-mvp"
npm install firebase
```

---

## 📦 الخطوة 3: إنشاء Firebase Config (3 دقائق)

### 3.1 إنشاء ملف Firebase Config

**ملف جديد**: `lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const storage = getStorage(app)
```

### 3.2 إنشاء ملف Environment Variables

**ملف جديد**: `.env.local`

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Site URL (موجود مسبقاً)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

⚠️ **ملاحظة**: استبدل القيم بالقيم الحقيقية من Firebase Console.

---

## 📦 الخطوة 4: نقل البيانات إلى Firebase (5 دقائق)

### 4.1 إنشاء Script للنقل

**ملف جديد**: `scripts/migrate-to-firebase.ts`

```typescript
import { ref, set } from 'firebase/database'
import { db } from '../lib/firebase'
import perfumesData from '../data/perfumes.json'
import storeConfig from '../data/store-config.json'

async function migrate() {
  // نقل المنتجات
  await set(ref(db, 'products'), perfumesData)
  console.log('✅ Products migrated')
  
  // نقل الإعدادات
  await set(ref(db, 'config'), storeConfig)
  console.log('✅ Config migrated')
  
  console.log('🎉 Migration complete!')
}

migrate()
```

### 4.2 تشغيل Script

```bash
# ستحتاج لتثبيت ts-node أولاً
npm install -D ts-node

# ثم تشغيل Script
npx ts-node scripts/migrate-to-firebase.ts
```

---

## 📦 الخطوة 5: إنشاء API Routes (10 دقائق)

### 5.1 API Route للمنتجات

**ملف جديد**: `app/api/admin/products/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db } from '@/lib/firebase'

// GET: قراءة المنتجات
export async function GET() {
  try {
    const snapshot = await get(ref(db, 'products'))
    const products = snapshot.val() || []
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST: حفظ المنتجات
export async function POST(request: NextRequest) {
  try {
    const products = await request.json()
    await set(ref(db, 'products'), products)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving products:', error)
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 })
  }
}
```

### 5.2 API Route للإعدادات

**ملف جديد**: `app/api/admin/config/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db } from '@/lib/firebase'

// GET: قراءة الإعدادات
export async function GET() {
  try {
    const snapshot = await get(ref(db, 'config'))
    const config = snapshot.val() || {}
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

// POST: حفظ الإعدادات
export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    await set(ref(db, 'config'), config)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
```

### 5.3 API Route لرفع الصور (اختياري)

**ملف جديد**: `app/api/admin/upload-image/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // رفع الصورة إلى Firebase Storage
    const storageRef = ref(storage, `images/${file.name}`)
    const bytes = await file.arrayBuffer()
    await uploadBytes(storageRef, bytes)
    
    // الحصول على URL
    const downloadURL = await getDownloadURL(storageRef)
    
    return NextResponse.json({ url: downloadURL })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
```

---

## 📦 الخطوة 6: تحديث المكونات لقراءة من Firebase (10 دقائق)

### 6.1 إنشاء Hook لقراءة البيانات

**ملف جديد**: `lib/useFirebaseData.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from './firebase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const productsRef = ref(db, 'products')
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || []
      setProducts(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { products, loading }
}

export function useStoreConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const configRef = ref(db, 'config')
    
    const unsubscribe = onValue(configRef, (snapshot) => {
      const data = snapshot.val() || {}
      setConfig(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { config, loading }
}
```

### 6.2 تحديث ProductListing

**تعديل**: `components/ProductListing.tsx`

```typescript
'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import ProductCarousel from './ProductCarousel'
import { useProducts } from '@/lib/useFirebaseData'
import styles from './ProductListing.module.css'

const GRID_ITEMS_COUNT = 6

export default function ProductListing() {
  const { products: perfumesData, loading } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (loading) {
    return <div>جاري التحميل...</div>
  }

  const gridProducts = perfumesData.slice(0, GRID_ITEMS_COUNT)
  const carouselProducts = perfumesData.slice(GRID_ITEMS_COUNT)

  return (
    // ... باقي الكود كما هو
  )
}
```

### 6.3 تحديث lib/config.ts

**تعديل**: `lib/config.ts`

```typescript
'use client'

import { useStoreConfig } from './useFirebaseData'

// Fallback للبيانات الثابتة
import storeConfigStatic from '@/data/store-config.json'

export function useStoreConfigData() {
  const { config, loading } = useStoreConfig()
  return { config: config || storeConfigStatic, loading }
}

// للاستخدام في Server Components
export { storeConfigStatic as storeConfigData }
```

---

## 📦 الخطوة 7: إنشاء صفحة Admin (20 دقيقة)

### 7.1 صفحة Admin الرئيسية

**ملف جديد**: `app/admin/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import styles from './admin.module.css'

interface Product {
  id: string
  name: string
  description: string
  image: string
  sizes: Array<{ size: string; price: number }>
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // تحميل البيانات
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, configRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/config'),
      ])
      
      const productsData = await productsRes.json()
      const configData = await configRes.json()
      
      setProducts(productsData)
      setConfig(configData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const saveProducts = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      })
      alert('تم الحفظ بنجاح!')
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...products]
    updated[index] = { ...updated[index], [field]: value }
    setProducts(updated)
  }

  if (loading) {
    return <div className={styles.container}>جاري التحميل...</div>
  }

  return (
    <div className={styles.container}>
      <h1>لوحة التحكم - Admin Panel</h1>
      
      {/* قائمة المنتجات */}
      <section className={styles.section}>
        <h2>المنتجات ({products.length})</h2>
        {products.map((product, index) => (
          <div key={product.id} className={styles.productCard}>
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateProduct(index, 'name', e.target.value)}
              placeholder="اسم المنتج"
            />
            <textarea
              value={product.description}
              onChange={(e) => updateProduct(index, 'description', e.target.value)}
              placeholder="الوصف"
            />
            <input
              type="text"
              value={product.image}
              onChange={(e) => updateProduct(index, 'image', e.target.value)}
              placeholder="مسار الصورة"
            />
          </div>
        ))}
        <button onClick={saveProducts} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ المنتجات'}
        </button>
      </section>
    </div>
  )
}
```

### 7.2 CSS للصفحة

**ملف جديد**: `app/admin/admin.module.css`

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  direction: rtl;
}

.section {
  margin: 30px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.productCard {
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
}

.productCard input,
.productCard textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #0070f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 📦 الخطوة 8: الاختبار (5 دقائق)

### 8.1 اختبار محلي

```bash
# شغّل المشروع
npm run dev

# افتح المتصفح
# http://localhost:3005/admin
```

### 8.2 تحقق من:
- ✅ صفحة Admin تفتح
- ✅ البيانات تظهر
- ✅ يمكن التعديل
- ✅ الحفظ يعمل
- ✅ التغييرات تظهر في الصفحة الرئيسية

---

## 📦 الخطوة 9: النشر (5 دقائق)

### 9.1 إضافة Environment Variables في Vercel

1. اذهب إلى Vercel Dashboard
2. Project Settings → Environment Variables
3. أضف جميع متغيرات `.env.local`

### 9.2 Deploy

```bash
vercel --prod
```

---

## ✅ Checklist النهائي

- [ ] Firebase Project تم إنشاؤه
- [ ] Realtime Database مفعّل
- [ ] Storage مفعّل
- [ ] Environment Variables مضبوطة
- [ ] البيانات نُقلت إلى Firebase
- [ ] API Routes تعمل
- [ ] صفحة Admin تعمل
- [ ] الاختبار المحلي نجح
- [ ] النشر على Vercel

---

## 🎉 النتيجة النهائية

- ✅ صفحة `/admin` معزولة
- ✅ تعديل المنتجات يعمل
- ✅ تعديل الإعدادات يعمل
- ✅ رفع صور جديدة (اختياري)
- ✅ التغييرات فورية

---

## ⚠️ ملاحظات مهمة

### الأمان:
- حالياً بدون Auth (لكن الرابط مخفي)
- يمكن إضافة كلمة مرور بسيطة لاحقاً
- في Production، غيّر Security Rules

### النسخ الاحتياطي:
- Firebase يحفظ تلقائياً
- يمكن Export البيانات من Firebase Console

### الصور:
- الصور القديمة تبقى في `public/images/`
- الصور الجديدة تُرفع إلى Firebase Storage
- يمكن استخدام كليهما معاً

---

**الوقت الإجمالي المتوقع: 60-90 دقيقة**

**تم إنشاء الخطة في:** $(date)
