# تفعيل Firebase Storage - حل مشكلة "يجب تغيير خطة المشروع"

## المشكلة
عند فتح Firebase Storage، تظهر رسالة:
> "Pour utiliser Storage, vous devez changer le forfait de votre projet"
> (لاستخدام Storage، يجب تغيير خطة المشروع)

## الحل ✅
المشكلة ليست في الخطة! المشكلة أن **Cloud Storage API** غير مفعّل في Google Cloud Console.

---

## خطوات تفعيل Cloud Storage API

### الطريقة 1: من Firebase Console (الأسهل)

1. **افتح Firebase Console:**
   - اذهب إلى: https://console.firebase.google.com/project/perfume-store-mvp

2. **اذهب إلى Project Settings:**
   - اضغط على ⚙️ (Settings) بجانب اسم المشروع
   - اختر **Project settings**

3. **افتح Google Cloud Console:**
   - في صفحة Project settings، ابحث عن قسم **"Your project"**
   - اضغط على **"Open in Google Cloud Console"** أو **"Go to Cloud Console"**
   - أو افتح مباشرة: https://console.cloud.google.com/home/dashboard?project=perfume-store-mvp

4. **فعّل Cloud Storage API:**
   - في Google Cloud Console، ابحث في شريط البحث العلوي عن: **"Cloud Storage API"**
   - أو اذهب إلى: **APIs & Services** → **Library**
   - ابحث عن **"Cloud Storage API"**
   - اضغط على النتيجة
   - اضغط على زر **"ENABLE"** أو **"تفعيل"**

5. **انتظر قليلاً** (30 ثانية - دقيقة)

6. **ارجع إلى Firebase Console:**
   - اذهب إلى: https://console.firebase.google.com/project/perfume-store-mvp/storage
   - **حدّث الصفحة** (F5)
   - يجب أن تظهر الآن خيارات "Get started" أو "Create bucket"

---

### الطريقة 2: من Google Cloud Console مباشرة

1. **افتح Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/library/storage-api.googleapis.com?project=perfume-store-mvp
   ```
   
   أو:
   - اذهب إلى: https://console.cloud.google.com
   - اختر مشروع **perfume-store-mvp**

2. **ابحث عن Cloud Storage API:**
   - من القائمة الجانبية: **APIs & Services** → **Library**
   - ابحث عن: **"Cloud Storage API"**
   - أو استخدم الرابط المباشر أعلاه

3. **فعّل API:**
   - اضغط على **"Cloud Storage API"**
   - اضغط على زر **"ENABLE"** أو **"تفعيل"**

4. **ارجع إلى Firebase Storage:**
   - اذهب إلى: https://console.firebase.google.com/project/perfume-store-mvp/storage
   - **حدّث الصفحة** (F5)

---

## بعد تفعيل API

بعد تفعيل Cloud Storage API، يجب أن ترى في Firebase Storage:

### ✅ السيناريو الصحيح:
- رسالة **"Get started"** أو **"Create bucket"**
- أو تبويبات **Files** و **Rules** (إذا كان Storage مفعّل بالفعل)

### ❌ إذا استمرت المشكلة:
- انتظر دقيقة أخرى ثم حدّث الصفحة
- تأكد من أنك في المشروع الصحيح (`perfume-store-mvp`)
- تأكد من أن Cloud Storage API تم تفعيله (من Google Cloud Console → APIs & Services → Enabled APIs)

---

## الخطوات التالية (بعد ظهور "Get started")

1. **اضغط "Get started"**
2. **اختر:**
   - ✅ **"Start in test mode"** (للتطوير)
   - Location: اختر أقرب موقع (مثلاً: **us-central1**)
3. **اضغط "Done"**

4. **اذهب إلى Rules:**
   - بعد التفعيل، ستجد تبويب **Rules**
   - انسخ هذا الكود:

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

5. **اضغط "Publish"**

6. **احصل على Bucket Name:**
   - من أعلى صفحة Storage: `gs://perfume-store-mvp.appspot.com`
   - أو: `perfume-store-mvp.appspot.com`

7. **أضف إلى `.env.local`:**
   ```env
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-mvp.appspot.com
   ```

8. **أعد تشغيل السيرفر:**
   ```bash
   npm run dev
   ```

---

## روابط سريعة

- **Firebase Console:** https://console.firebase.google.com/project/perfume-store-mvp
- **Firebase Storage:** https://console.firebase.google.com/project/perfume-store-mvp/storage
- **Google Cloud Console:** https://console.cloud.google.com/home/dashboard?project=perfume-store-mvp
- **Cloud Storage API (تفعيل مباشر):** https://console.cloud.google.com/apis/library/storage-api.googleapis.com?project=perfume-store-mvp

---

## ملاحظات مهمة

⚠️ **Firebase Storage متاح في الخطة المجانية (Spark Plan)**
- لا تحتاج لترقية الخطة
- المشكلة فقط في تفعيل API

✅ **بعد تفعيل API، Storage سيعمل بشكل طبيعي**

---

## إذا استمرت المشكلة

1. تأكد من أن Cloud Storage API مفعّل:
   - Google Cloud Console → APIs & Services → Enabled APIs
   - ابحث عن "Cloud Storage API"

2. تأكد من أنك في المشروع الصحيح:
   - Project ID: `perfume-store-mvp`

3. انتظر دقيقة ثم حدّث صفحة Firebase Storage

4. إذا لم ينجح، جرّب:
   - امسح Cache المتصفح (Ctrl+Shift+Delete)
   - افتح Firebase Storage في نافذة خاصة (Incognito)
