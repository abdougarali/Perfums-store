# إصلاح مشكلة رفع الصور - Firebase Storage

## المشكلة
عند محاولة رفع صورة من Admin Panel، تظهر رسالة خطأ: "Failed to upload image"

## الحلول المحتملة

### 1. التحقق من Firebase Storage Bucket

تأكد من أن متغير البيئة `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` موجود في `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**ملاحظة:** يمكنك العثور على Storage Bucket من Firebase Console:
- اذهب إلى Firebase Console
- اختر مشروعك
- اذهب إلى **Storage**
- انسخ الـ Bucket name (مثل: `your-project-id.appspot.com`)

---

### 2. إعداد Firebase Storage Security Rules

المشكلة الأكثر شيوعاً هي أن Security Rules تمنع الرفع. يجب تحديث القواعد:

#### الخطوات:

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Storage** من القائمة الجانبية
4. اضغط على تبويب **Rules**
5. استبدل القواعد الحالية بهذه القواعد:

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all images
    match /images/{imageId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

6. اضغط على **Publish** لحفظ التغييرات

---

### 3. التحقق من حجم الصورة

الكود الآن يتحقق من حجم الصورة (الحد الأقصى: 10MB). إذا كانت الصورة أكبر من 10MB، ستحصل على رسالة خطأ واضحة.

---

### 4. التحقق من Console Logs

بعد التحسينات، ستحصل على رسائل خطأ أكثر تفصيلاً في:
- **Browser Console** (F12 → Console)
- **Server Logs** (في terminal حيث يعمل `npm run dev`)

ستجد معلومات مثل:
- هل Firebase Storage مُعدّ بشكل صحيح؟
- ما هو نوع الخطأ (Permission, Quota, etc.)؟
- تفاصيل الخطأ

---

### 5. اختبار الرفع

بعد إصلاح Security Rules:

1. افتح `http://localhost:3005/admin`
2. انتقل إلى تبويب "إدارة المنتجات"
3. اختر منتج
4. اضغط على "رفع الصور"
5. اختر صورة (أقل من 10MB)
6. يجب أن تظهر رسالة نجاح

---

## رسائل الخطأ الشائعة

### "Firebase Storage is not configured"
**الحل:** تأكد من وجود `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` في `.env.local`

### "Permission denied" أو "storage/unauthorized"
**الحل:** حدث Firebase Storage Security Rules كما هو موضح أعلاه

### "Storage quota exceeded"
**الحل:** Firebase Storage quota ممتلئ. يجب ترقية الخطة أو حذف ملفات قديمة

### "File is too large"
**الحل:** الصورة أكبر من 10MB. استخدم صورة أصغر

---

## ملاحظات مهمة

⚠️ **Security Rules المذكورة أعلاه تسمح بالقراءة والكتابة للجميع (للتطوير فقط)**

للإنتاج، يجب استخدام قواعد أكثر أماناً مع Authentication:

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      // Allow read for everyone
      allow read: if true;
      
      // Allow write only for authenticated users (if you add auth later)
      allow write: if request.auth != null;
      
      // Or allow write for everyone (for MVP without auth)
      allow write: if true;
    }
  }
}
```

---

## إذا استمرت المشكلة

1. افتح Browser Console (F12)
2. حاول رفع صورة
3. انسخ رسالة الخطأ الكاملة
4. راجع Server Logs في terminal
5. تأكد من أن جميع متغيرات Firebase موجودة في `.env.local`
