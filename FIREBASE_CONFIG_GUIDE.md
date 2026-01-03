# 🔥 دليل الحصول على Firebase Config - خطوة بخطوة

## 📍 أين تجد Firebase Config؟

### الخطوة 1: افتح Firebase Console
1. اذهب إلى: https://console.firebase.google.com/
2. سجّل الدخول بحساب Google

### الخطوة 2: اختر أو أنشئ Project
- إذا كان لديك Project موجود: اختره من القائمة
- إذا لم يكن لديك Project: اضغط **Add project** → اتبع التعليمات

### الخطوة 3: اذهب إلى Project Settings
1. في Firebase Console، ابحث عن **⚙️ Settings** (الإعدادات)
2. يمكن أن يكون في:
   - **القائمة الجانبية اليسرى** → اضغط على **⚙️ Project settings**
   - أو في **شريط القوائم العلوي** → اضغط على **⚙️** بجانب اسم المشروع

### الخطوة 4: اذهب إلى قسم "Your apps"
1. في صفحة **Project Settings**، ستجد عدة تبويبات في الأعلى:
   - General
   - **Your apps** ← هذا ما تريده
   - Service accounts
   - وغيرها...

2. اضغط على تبويب **Your apps**

### الخطوة 5: أضف Web App
1. في قسم **Your apps**، ستجد أيقونات لأنواع التطبيقات:
   - 📱 iOS
   - 🤖 Android
   - **🌐 Web** ← هذا ما تريده
   - وغيرها...

2. اضغط على أيقونة **Web** (</>)

3. ستظهر نافذة منبثقة:
   - **App nickname**: أدخل اسم مثل `perfume-store-web`
   - **Firebase Hosting**: **لا** تفعّل هذا (اتركه غير مفعّل)
   - اضغط **Register app**

### الخطوة 6: انسخ Firebase Config
بعد الضغط على **Register app**، ستظهر لك صفحة تحتوي على:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**هذا هو Firebase Config!**

---

## 📝 كيفية نسخ القيم

### الطريقة 1: نسخ كل القيم يدوياً
انسخ كل قيمة من `firebaseConfig` وأضفها في `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### الطريقة 2: إذا لم تجد Firebase Config

إذا لم تجد Firebase Config في الصفحة، يمكنك:

1. **العودة إلى Project Settings**
   - اضغط **⚙️ Project settings**
   - اذهب إلى تبويب **General**
   - في قسم **Your apps**، ستجد قائمة بالتطبيقات
   - اضغط على التطبيق الذي أنشأته (Web app)
   - ستجد **Firebase SDK snippet** → اختر **Config**

2. **أو ابحث عن "SDK setup and configuration"**
   - في صفحة Project Settings
   - ابحث عن قسم **SDK setup and configuration**
   - اختر **Config** من القائمة المنسدلة

---

## 🎯 مثال عملي

لنفترض أن Firebase Config الخاص بك هو:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEf1234567890GhIjKlMnOpQrStUvWxYz",
  authDomain: "perfume-store-12345.firebaseapp.com",
  databaseURL: "https://perfume-store-12345-default-rtdb.firebaseio.com",
  projectId: "perfume-store-12345",
  storageBucket: "perfume-store-12345.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abc123def456ghi789"
};
```

**ملف `.env.local` يجب أن يكون:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEf1234567890GhIjKlMnOpQrStUvWxYz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=perfume-store-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://perfume-store-12345-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=perfume-store-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321098
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321098:web:abc123def456ghi789
```

---

## 🔍 إذا لم تجد "Your apps"

إذا لم تجد قسم **Your apps** في Project Settings:

1. **تأكد أنك في Project Settings الصحيح**
   - اضغط على **⚙️** بجانب اسم المشروع في الأعلى
   - أو من القائمة الجانبية → **Project settings**

2. **تأكد أنك في التبويب الصحيح**
   - في صفحة Project Settings، تأكد أنك في تبويب **General** (ليس Service accounts أو غيرها)

3. **أضف Web App إذا لم يكن موجوداً**
   - في صفحة Project Settings → تبويب **General**
   - ابحث عن قسم **Your apps**
   - إذا كان فارغاً، اضغط على أيقونة **Web** (</>) لإضافة Web App

---

## 📸 أماكن محتملة لـ Firebase Config

1. **بعد إضافة Web App مباشرة**
   - عند الضغط على **Register app**، تظهر الصفحة مع Firebase Config

2. **في Project Settings → Your apps**
   - اضغط على التطبيق (Web app) من القائمة
   - ستجد **Firebase SDK snippet** → اختر **Config**

3. **في صفحة Project Overview**
   - أحياناً تظهر في الصفحة الرئيسية للمشروع
   - ابحث عن **Add Firebase to your web app** أو **Get started**

---

## ⚠️ ملاحظات مهمة

1. **databaseURL قد لا يظهر مباشرة**
   - إذا لم تجد `databaseURL` في Firebase Config
   - اذهب إلى **Realtime Database** في Firebase Console
   - في الأعلى ستجد رابط مثل: `https://your-project-default-rtdb.firebaseio.com`
   - هذا هو `databaseURL`

2. **storageBucket قد لا يظهر مباشرة**
   - إذا لم تجد `storageBucket`
   - اذهب إلى **Storage** في Firebase Console
   - في الأعلى ستجد رابط مثل: `your-project.appspot.com`
   - هذا هو `storageBucket`

---

## 🆘 إذا استمرت المشكلة

إذا لم تجد Firebase Config بعد كل هذا:

1. **تأكد أنك أنشأت Web App**
   - اذهب إلى Project Settings → Your apps
   - إذا لم تجد Web App، أضفه (اضغط على أيقونة Web)

2. **جرب طريقة بديلة**
   - اذهب إلى **Realtime Database**
   - اضغط على **Get started** (إذا لم تكن مفعّلة)
   - بعد تفعيلها، اذهب إلى Project Settings
   - يجب أن تظهر Firebase Config

3. **أخبرني بالضبط ماذا ترى**
   - ما هي الصفحة التي أنت فيها؟
   - ما هي الأقسام/التبويبات التي تراها؟
   - سأساعدك خطوة بخطوة

---

**تم إنشاء الدليل في:** $(date)
