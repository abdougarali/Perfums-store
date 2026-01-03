# 🔧 إعداد Environment Variables في Vercel

## ❌ المشكلة

عند محاولة الحفظ في صفحة Admin على Vercel:
- ❌ يظهر خطأ: "❌ حدث خطأ أثناء الحفظ"
- ✅ يعمل محلياً بشكل جيد

**السبب**: Environment Variables غير موجودة في Vercel.

---

## ✅ الحل: إضافة Environment Variables في Vercel

### الخطوة 1: اذهب إلى Vercel Dashboard
1. افتح: https://vercel.com/dashboard
2. سجّل الدخول
3. اختر مشروعك: `al-attar` (أو اسم المشروع)

### الخطوة 2: اذهب إلى Project Settings
1. اضغط على اسم المشروع
2. اضغط على **Settings** (الإعدادات)
3. في القائمة الجانبية، اضغط **Environment Variables**

### الخطوة 3: أضف Environment Variables
أضف كل متغير على حدة:

#### 1. Firebase API Key
- **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value**: `AIzaSyAnPy9cPuhUpy1bs-ey_v_s6SZG264fw_c`
- **Environment**: Production, Preview, Development (اختر الكل)
- اضغط **Save**

#### 2. Firebase Auth Domain
- **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value**: `perfume-store-mvp.firebaseapp.com`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 3. Firebase Database URL
- **Name**: `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- **Value**: `https://perfume-store-mvp-default-rtdb.firebaseio.com`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 4. Firebase Project ID
- **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value**: `perfume-store-mvp`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 5. Firebase Storage Bucket
- **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value**: `perfume-store-mvp.firebasestorage.app`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 6. Firebase Messaging Sender ID
- **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `754376129268`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 7. Firebase App ID
- **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value**: `1:754376129268:web:543603697f224ca674bca1`
- **Environment**: Production, Preview, Development
- اضغط **Save**

#### 8. Site URL (موجود مسبقاً)
- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://al-attar.vercel.app`
- **Environment**: Production, Preview, Development
- اضغط **Save**

---

## 📋 قائمة سريعة للنسخ

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAnPy9cPuhUpy1bs-ey_v_s6SZG264fw_c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=perfume-store-mvp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://perfume-store-mvp-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=perfume-store-mvp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-mvp.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=754376129268
NEXT_PUBLIC_FIREBASE_APP_ID=1:754376129268:web:543603697f224ca674bca1
NEXT_PUBLIC_SITE_URL=https://al-attar.vercel.app
```

---

## 🔄 الخطوة 4: إعادة Deploy

بعد إضافة جميع Environment Variables:

1. اذهب إلى **Deployments** في Vercel
2. اضغط على **...** بجانب آخر Deployment
3. اختر **Redeploy**
4. أو Push تغيير جديد إلى GitHub (سيحدث Redeploy تلقائياً)

---

## ✅ التحقق من النجاح

بعد Redeploy:

1. افتح: https://al-attar.vercel.app/admin
2. عدّل منتج
3. اضغط **حفظ جميع التغييرات**
4. يجب أن ترى: "✅ تم حفظ المنتجات بنجاح!"

---

## 🐛 إذا استمرت المشكلة

### 1. تحقق من Environment Variables
- تأكد أن جميع المتغيرات موجودة
- تأكد أن القيم صحيحة (بدون مسافات إضافية)
- تأكد أن Environment = Production, Preview, Development

### 2. تحقق من Firebase Security Rules
- اذهب إلى Firebase Console
- Realtime Database → Rules
- تأكد أن القواعد تسمح بالكتابة:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 3. تحقق من Console
- افتح Developer Tools (F12)
- اذهب إلى Console
- ابحث عن أخطاء Firebase

---

## 📝 ملاحظات مهمة

1. **Environment Variables حساسة**
   - لا تشاركها في GitHub
   - لا تضعها في ملفات عامة

2. **بعد إضافة Environment Variables**
   - يجب Redeploy المشروع
   - التغييرات لا تطبق تلقائياً

3. **Production vs Development**
   - Production = الموقع المباشر (al-attar.vercel.app)
   - Preview = Pull Requests
   - Development = Local development

---

**تم إنشاء الملف في:** $(date)
