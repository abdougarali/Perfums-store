# تفعيل Firebase Storage - خطوة بخطوة 🔥

## المشكلة الحالية
- Storage غير موجود في قائمة المنتجات
- لا توجد خيارات "Get started" أو "Create bucket"
- تظهر رسالة "يجب تغيير خطة المشروع" (لكن المشكلة ليست الخطة!)

---

## ✅ الحل: تفعيل Cloud Storage API

### الخطوة 1: فتح Google Cloud Console

**افتح هذا الرابط مباشرة:**
```
https://console.cloud.google.com/apis/library/storage-api.googleapis.com?project=perfume-store-mvp
```

أو:

1. اذهب إلى: https://console.cloud.google.com
2. تأكد من أن المشروع المحدد هو: **perfume-store-mvp**
   - إذا لم يكن كذلك، اختره من القائمة المنسدلة في الأعلى

---

### الخطوة 2: تفعيل Cloud Storage API

1. **في صفحة Cloud Storage API:**
   - ستجد زر كبير **"ENABLE"** أو **"تفعيل"**
   - اضغط عليه

2. **انتظر:**
   - قد يستغرق 30-60 ثانية
   - ستظهر رسالة "API enabled" أو "تم تفعيل API"

---

### الخطوة 3: التحقق من التفعيل

1. **اذهب إلى صفحة APIs المفعلة:**
   ```
   https://console.cloud.google.com/apis/dashboard?project=perfume-store-mvp
   ```

2. **ابحث عن "Cloud Storage API":**
   - يجب أن يظهر في قائمة "Enabled APIs"
   - إذا لم يظهر، انتظر دقيقة أخرى ثم حدّث الصفحة

---

### الخطوة 4: العودة إلى Firebase Storage

1. **افتح Firebase Storage:**
   ```
   https://console.firebase.google.com/project/perfume-store-mvp/storage
   ```

2. **حدّث الصفحة:**
   - اضغط F5 أو Ctrl+R
   - **انتظر 30-60 ثانية** (قد يحتاج Firebase وقت لتحديث الحالة)

3. **ما الذي يجب أن تراه:**
   - ✅ رسالة **"Get started"** أو **"Create bucket"**
   - ✅ أو تبويبات **Files** و **Rules** (إذا كان Storage مفعّل بالفعل)

---

## إذا لم تظهر "Get started" بعد التفعيل

### الحل 1: انتظر أكثر
- قد يحتاج Firebase 2-3 دقائق لتحديث الحالة
- حدّث الصفحة كل دقيقة

### الحل 2: امسح Cache المتصفح
1. اضغط **Ctrl + Shift + Delete**
2. اختر "Cached images and files"
3. اضغط "Clear data"
4. حدّث صفحة Firebase Storage

### الحل 3: افتح في نافذة خاصة
1. اضغط **Ctrl + Shift + N** (Chrome) أو **Ctrl + Shift + P** (Firefox)
2. افتح Firebase Storage في النافذة الخاصة

### الحل 4: تحقق من Cloud Storage API مرة أخرى
1. اذهب إلى: https://console.cloud.google.com/apis/dashboard?project=perfume-store-mvp
2. تأكد من أن "Cloud Storage API" موجود في "Enabled APIs"
3. إذا لم يكن موجوداً، فعّله مرة أخرى

---

## بعد ظهور "Get started"

### 1. اضغط "Get started"

### 2. اختر الإعدادات:
- ✅ **"Start in test mode"** (للتطوير)
- **Location:** اختر أقرب موقع:
  - `us-central1` (أمريكا الوسطى)
  - `europe-west1` (أوروبا)
  - `asia-southeast1` (آسيا)

### 3. اضغط "Done"

### 4. انتظر حتى يتم إنشاء Bucket (30-60 ثانية)

---

## بعد تفعيل Storage

### 1. إعداد Security Rules

1. **اذهب إلى تبويب Rules:**
   - في صفحة Storage، اضغط على **Rules**

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

### 2. الحصول على Bucket Name

1. **من صفحة Storage:**
   - في الأعلى ستجد: `gs://perfume-store-mvp.appspot.com`
   - أو: `perfume-store-mvp.appspot.com`

2. **انسخ Bucket Name:**
   - بدون `gs://`
   - مثال: `perfume-store-mvp.appspot.com`

---

### 3. إضافة إلى `.env.local`

افتح ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-mvp.appspot.com
```

**ملاحظة:** استبدل `perfume-store-mvp.appspot.com` بالقيمة الفعلية من Firebase Console.

---

### 4. إعادة تشغيل السيرفر

```bash
npm run dev
```

---

## روابط سريعة

- **تفعيل Cloud Storage API:** https://console.cloud.google.com/apis/library/storage-api.googleapis.com?project=perfume-store-mvp
- **APIs المفعلة:** https://console.cloud.google.com/apis/dashboard?project=perfume-store-mvp
- **Firebase Storage:** https://console.firebase.google.com/project/perfume-store-mvp/storage
- **Google Cloud Console:** https://console.cloud.google.com/home/dashboard?project=perfume-store-mvp

---

## ملاحظات مهمة

⚠️ **Storage متاح في الخطة المجانية**
- لا تحتاج لترقية الخطة
- المشكلة فقط في تفعيل API

✅ **بعد تفعيل API، انتظر 1-2 دقيقة قبل التحقق من Firebase Storage**

---

## إذا استمرت المشكلة

أرسل:
1. لقطة شاشة من صفحة "Enabled APIs" في Google Cloud Console
2. لقطة شاشة من صفحة Firebase Storage بعد التحديث
3. رسالة الخطأ (إن وجدت)
