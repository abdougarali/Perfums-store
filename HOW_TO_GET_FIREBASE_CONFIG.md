# 🎯 كيف تحصل على Firebase Config - خطوة بخطوة بسيطة

## 📍 الخطوات بالتفصيل

### الخطوة 1: افتح Firebase Console
```
https://console.firebase.google.com/
```

### الخطوة 2: اختر المشروع
- إذا كان لديك مشروع: اختره
- إذا لم يكن لديك: اضغط **Add project** → اتبع التعليمات

### الخطوة 3: ابحث عن ⚙️ Settings
في Firebase Console، ابحث عن أيقونة **⚙️** (الإعدادات)

**يمكن أن تكون في:**
- القائمة الجانبية اليسرى → **⚙️ Project settings**
- أو في الأعلى بجانب اسم المشروع → **⚙️**

### الخطوة 4: اضغط على ⚙️ Project settings
بعد الضغط على ⚙️، ستفتح صفحة الإعدادات

### الخطوة 5: ابحث عن "Your apps"
في صفحة الإعدادات، ستجد تبويبات في الأعلى:
- **General** ← اضغط هنا
- Your apps
- Service accounts
- وغيرها...

### الخطوة 6: أضف Web App
في قسم **Your apps**، ستجد أيقونات:
- 📱 iOS
- 🤖 Android
- **🌐 Web** ← اضغط هنا

### الخطوة 7: سجّل Web App
بعد الضغط على Web، ستظهر نافذة:
- **App nickname**: أدخل `perfume-store-web`
- **Firebase Hosting**: **اتركه غير مفعّل**
- اضغط **Register app**

### الخطوة 8: انسخ Firebase Config
بعد **Register app**، ستظهر صفحة تحتوي على:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

**انسخ كل قيمة!**

---

## 🔄 إذا لم تجد Firebase Config هنا

### الطريقة البديلة:

1. **ارجع إلى Project Settings**
2. اضغط على تبويب **Your apps**
3. ستجد قائمة بالتطبيقات
4. اضغط على Web App الذي أنشأته
5. ستجد **Firebase SDK snippet**
6. اختر **Config** من القائمة
7. ستظهر Firebase Config

---

## 📝 مثال: كيف تملأ `.env.local`

لنفترض أن Firebase Config هو:

```javascript
apiKey: "AIzaSy1234567890"
authDomain: "my-project.firebaseapp.com"
databaseURL: "https://my-project-default-rtdb.firebaseio.com"
projectId: "my-project"
storageBucket: "my-project.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc123"
```

**ملف `.env.local`:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy1234567890
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://my-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 🆘 إذا استمرت المشكلة

**أخبرني:**
1. هل أنت في Firebase Console الآن؟
2. ما هي الصفحة التي تراها؟
3. هل ترى أيقونة ⚙️ Settings؟
4. هل ترى قسم "Your apps"؟

**سأساعدك خطوة بخطوة!**

---

## 📚 ملفات مساعدة أخرى

- `FIREBASE_CONFIG_GUIDE.md` - دليل تفصيلي
- `FIREBASE_MANUAL_CONFIG.md` - طريقة يدوية للحصول على القيم

---

**تم إنشاء الدليل في:** $(date)
