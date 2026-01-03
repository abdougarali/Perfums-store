# 🚀 Firebase Admin Panel - Quick Start

## ⚡ الخطوات السريعة (60-90 دقيقة)

### 1️⃣ إعداد Firebase (10 دقائق)
- [ ] إنشاء حساب: https://console.firebase.google.com/
- [ ] إنشاء Project جديد
- [ ] تفعيل **Realtime Database** (test mode)
- [ ] تفعيل **Storage** (اختياري - راجع `FIREBASE_STORAGE_NOTE.md`)
- [ ] نسخ Firebase Config

### 2️⃣ تثبيت المكتبات (2 دقيقة)
```bash
npm install firebase
```

### 3️⃣ إعداد Environment Variables (3 دقائق)
- [ ] إنشاء `.env.local`
- [ ] إضافة Firebase Config

### 4️⃣ نقل البيانات (5 دقائق)
- [ ] إنشاء Migration Script
- [ ] تشغيل Script لنقل البيانات

### 5️⃣ إنشاء API Routes (10 دقائق)
- [ ] `/api/admin/products` (GET/POST)
- [ ] `/api/admin/config` (GET/POST)
- [ ] `/api/admin/upload-image` (POST) - اختياري

### 6️⃣ تحديث المكونات (10 دقائق)
- [ ] إنشاء `useFirebaseData` hook
- [ ] تحديث `ProductListing` لقراءة من Firebase
- [ ] تحديث `lib/config.ts`

### 7️⃣ إنشاء صفحة Admin (20 دقيقة)
- [ ] `app/admin/page.tsx`
- [ ] `app/admin/admin.module.css`
- [ ] واجهة التعديل

### 8️⃣ الاختبار (5 دقائق)
- [ ] اختبار محلي
- [ ] التحقق من الحفظ

### 9️⃣ النشر (5 دقائق)
- [ ] إضافة Environment Variables في Vercel
- [ ] Deploy

---

## 📝 الملفات المطلوبة

### ملفات جديدة:
```
lib/
  ├── firebase.ts              # Firebase Config
  └── useFirebaseData.ts       # Hooks لقراءة البيانات

app/
  ├── api/admin/
  │   ├── products/route.ts    # API للمنتجات
  │   ├── config/route.ts      # API للإعدادات
  │   └── upload-image/route.ts # API لرفع الصور
  └── admin/
      ├── page.tsx             # صفحة Admin
      └── admin.module.css     # CSS

scripts/
  └── migrate-to-firebase.ts   # Script للنقل

.env.local                     # Environment Variables
```

### ملفات للتعديل:
```
components/
  └── ProductListing.tsx       # قراءة من Firebase

lib/
  └── config.ts               # قراءة من Firebase
```

---

## 🔑 Firebase Config المطلوب

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## ✅ النتيجة

- صفحة `/admin` معزولة
- تعديل المنتجات والإعدادات
- رفع صور جديدة (اختياري)
- التغييرات فورية

---

**راجع `FIREBASE_BUILD_PLAN.md` للتفاصيل الكاملة**
