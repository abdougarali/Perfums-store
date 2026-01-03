# 🔧 طريقة بديلة: الحصول على Firebase Config يدوياً

إذا لم تجد Firebase Config مباشرة، يمكنك الحصول على القيم يدوياً:

---

## 📋 الخطوات اليدوية

### 1. apiKey و projectId و authDomain

1. اذهب إلى **⚙️ Project Settings** (إعدادات المشروع)
2. اذهب إلى تبويب **General**
3. في قسم **Project ID**، ستجد:
   - **Project ID**: هذا هو `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - **Project number**: هذا هو `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

4. في قسم **Your apps**:
   - إذا كان لديك Web App، اضغط عليه
   - ستجد **Web API Key**: هذا هو `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **authDomain** = `{project-id}.firebaseapp.com`

### 2. databaseURL

1. اذهب إلى **Build** → **Realtime Database**
2. إذا لم تكن مفعّلة، اضغط **Create Database**
3. بعد التفعيل، في أعلى الصفحة ستجد رابط مثل:
   ```
   https://your-project-default-rtdb.firebaseio.com
   ```
   هذا هو `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

### 3. storageBucket

1. اذهب إلى **Build** → **Storage**
2. إذا لم تكن مفعّلة، اضغط **Get started**
3. بعد التفعيل، في أعلى الصفحة ستجد رابط مثل:
   ```
   your-project.appspot.com
   ```
   هذا هو `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

### 4. appId

1. اذهب إلى **⚙️ Project Settings** → **Your apps**
2. اضغط على Web App الذي أنشأته
3. ستجد **App ID** في الصفحة
   - أو يمكنك إنشاؤه من جديد إذا لم يكن موجوداً

---

## 📝 مثال عملي

لنفترض أن:
- **Project ID** = `perfume-store-12345`
- **Web API Key** = `AIzaSyAbCdEf1234567890`
- **Project number** = `987654321098`
- **databaseURL** = `https://perfume-store-12345-default-rtdb.firebaseio.com`
- **storageBucket** = `perfume-store-12345.appspot.com`
- **App ID** = `1:987654321098:web:abc123def456`

**ملف `.env.local`:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEf1234567890
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=perfume-store-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://perfume-store-12345-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=perfume-store-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=perfume-store-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321098
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321098:web:abc123def456
```

---

## 🎯 الخطوات السريعة

1. **Project Settings** → **General** → انسخ **Project ID**
2. **Project Settings** → **Your apps** → Web App → انسخ **Web API Key**
3. **Realtime Database** → انسخ **databaseURL** من الأعلى
4. **Storage** → انسخ **storageBucket** من الأعلى
5. **Project Settings** → **General** → انسخ **Project number**

---

**تم إنشاء الدليل في:** $(date)
