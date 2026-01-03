# 🔒 حل مشكلة Permission Denied

## ❌ المشكلة

```
Error: Permission denied
GET /api/admin/products 500
GET /api/admin/config 500
```

## ✅ الحل: تحديث Security Rules

### الخطوة 1: اذهب إلى Firebase Console
1. افتح: https://console.firebase.google.com/
2. اختر مشروعك: `perfume-store-mvp`

### الخطوة 2: تحديث Realtime Database Rules
1. من القائمة الجانبية، اضغط **Build** → **Realtime Database**
2. اضغط على تبويب **Rules** (في الأعلى)
3. استبدل القواعد الحالية بهذا:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. اضغط **Publish** (في الأعلى)

### الخطوة 3: أعد تحميل صفحة Admin
- بعد Publish، أعد تحميل صفحة Admin في المتصفح
- يجب أن تعمل الآن!

---

## ⚠️ ملاحظة مهمة

هذه القواعد للاختبار فقط. في Production، استخدم قواعد أكثر أماناً مثل:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": true
    },
    "config": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

**تم إنشاء الملف في:** $(date)
