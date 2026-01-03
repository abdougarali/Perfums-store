# إنشاء Storage Bucket يدوياً من Google Cloud Console

## متى تستخدم هذا الحل؟
- ✅ Cloud Storage API مفعّل
- ❌ لكن Firebase Storage لا يزال لا يظهر "Get started"
- ⏰ انتظرت 2-3 دقائق بعد تفعيل API

---

## خطوات إنشاء Bucket يدوياً

### الخطوة 1: فتح Cloud Storage

1. **من Google Cloud Console:**
   - من القائمة الجانبية (☰)، ابحث عن **"Cloud Storage"**
   - أو افتح مباشرة: https://console.cloud.google.com/storage/browser?project=perfume-store-mvp

2. **إذا ظهرت رسالة "Get started":**
   - اضغط "Get started"
   - اختر "Create a bucket"

---

### الخطوة 2: إنشاء Bucket

1. **Name (اسم Bucket):**
   - يجب أن يكون فريد عالمياً
   - استخدم: `perfume-store-mvp.appspot.com`
   - أو: `perfume-store-mvp-storage`

2. **Location type:**
   - اختر **"Region"**

3. **Location:**
   - اختر أقرب موقع:
     - `us-central1` (أمريكا)
     - `europe-west1` (أوروبا)
     - `asia-southeast1` (آسيا)

4. **Storage class:**
   - اختر **"Standard"**

5. **Access control:**
   - اختر **"Uniform"** (للتطوير)

6. **Protection:**
   - اتركه فارغاً (للتطوير)

7. **اضغط "Create"**

---

### الخطوة 3: ربط Bucket مع Firebase

بعد إنشاء Bucket:

1. **ارجع إلى Firebase Console:**
   ```
   https://console.firebase.google.com/project/perfume-store-mvp/storage
   ```

2. **حدّث الصفحة (F5)**

3. **يجب أن يظهر Bucket الآن**

---

### الخطوة 4: إعداد Security Rules

1. **في Firebase Storage:**
   - اضغط على تبويب **Rules**

2. **انسخ هذا الكود:**

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. **اضغط "Publish"**

---

### الخطوة 5: الحصول على Bucket Name

1. **من Firebase Storage:**
   - في الأعلى ستجد: `gs://perfume-store-mvp.appspot.com`
   - أو من Google Cloud Storage: اسم Bucket الذي أنشأته

2. **انسخ Bucket Name:**
   - بدون `gs://`
   - مثال: `perfume-store-mvp.appspot.com`

---

### الخطوة 6: إضافة إلى `.env.local`

افتح ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-mvp.appspot.com
```

**ملاحظة:** استبدل بالقيمة الفعلية من Firebase Console.

---

### الخطوة 7: إعادة تشغيل السيرفر

```bash
npm run dev
```

---

## روابط سريعة

- **Cloud Storage:** https://console.cloud.google.com/storage/browser?project=perfume-store-mvp
- **Firebase Storage:** https://console.firebase.google.com/project/perfume-store-mvp/storage

---

## ملاحظات مهمة

⚠️ **اسم Bucket يجب أن يكون فريد عالمياً**
- إذا كان `perfume-store-mvp.appspot.com` مستخدم، جرب:
  - `perfume-store-mvp-storage`
  - `perfume-store-mvp-images`
  - `perfume-store-mvp-[رقم]`

✅ **بعد إنشاء Bucket، انتظر 30-60 ثانية قبل التحقق من Firebase Storage**
