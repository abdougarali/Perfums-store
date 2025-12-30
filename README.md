# متجر العطور الفاخرة - MVP

موقع MVP خفيف لمتجر عطور يعتمد على واتساب للطلبات.

## المميزات

- ✅ عرض العطور بشكل احترافي
- ✅ اختيار الحجم والسعر
- ✅ طلب مباشر عبر واتساب مع رسالة مسبقة التعبئة
- ✅ تصميم فاخر وأنيق (أسود + ذهبي)
- ✅ متجاوب بالكامل (Mobile First)
- ✅ سريع التحميل
- ✅ بدون Backend أو Auth أو Payment Gateway

## التقنيات المستخدمة

- Next.js 14 (App Router)
- TypeScript
- CSS Modules
- Google Fonts (Cairo للعربية)

## التثبيت والتشغيل

```bash
# تثبيت المكتبات
npm install

# تشغيل المشروع في وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل المشروع بعد البناء
npm start
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## التخصيص

### تغيير بيانات المتجر

عدّل ملف `data/store-config.json`:
- `storeName`: اسم المتجر
- `whatsappNumber`: رقم واتساب (بدون + أو مسافات)
- `instagram`: رابط إنستغرام
- `facebook`: رابط فيسبوك

### إضافة/تعديل العطور

عدّل ملف `data/perfumes.json`:
- أضف أو عدّل بيانات العطور
- كل عطر يحتوي على: `id`, `name`, `description`, `image`, `sizes`

### تغيير الصور

ضع صور العطور في مجلد `public/images/` وعدّل مسارات الصور في `data/perfumes.json`.

## البنية

```
perfume-store-mvp/
├── app/
│   ├── layout.tsx          # Layout الرئيسي
│   ├── page.tsx            # الصفحة الرئيسية
│   └── globals.css         # الأنماط العامة
├── components/
│   ├── Hero.tsx            # قسم Hero
│   ├── ProductListing.tsx  # قائمة المنتجات
│   ├── ProductCard.tsx     # بطاقة المنتج
│   ├── ProductModal.tsx    # نافذة تفاصيل المنتج
│   ├── TrustSection.tsx    # قسم الثقة
│   └── Footer.tsx          # التذييل
├── data/
│   ├── perfumes.json       # بيانات العطور
│   └── store-config.json   # إعدادات المتجر
└── public/
    └── images/             # صور المنتجات
```

## ملاحظات

- هذا مشروع MVP مبسط للعرض على العملاء
- البيانات ثابتة (Static) ولا تحتاج Backend
- سهل التخصيص والنسخ لعملاء آخرين
- يمكن ترقيته لاحقًا إلى نسخة كاملة مع Backend و Payment Gateway

