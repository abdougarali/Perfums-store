# متجر العطور الفاخرة - MVP

موقع MVP خفيف لمتجر عطور يعتمد على واتساب للطلبات.

## 🎯 الهدف

هذا المشروع هو **MVP جاهز للبيع** لمتاجر العطور التي تريد:
- عرض منتجاتها بشكل احترافي
- استقبال الطلبات عبر واتساب
- موقع سريع وبسيط بدون تعقيدات

## ✨ المميزات

- ✅ عرض العطور بشكل احترافي (Grid + Carousel)
- ✅ اختيار الحجم والسعر
- ✅ طلب مباشر عبر واتساب مع رسالة مسبقة التعبئة
- ✅ تصميم فاخر وأنيق (Unisex Theme)
- ✅ متجاوب بالكامل (Mobile First)
- ✅ سريع التحميل
- ✅ SEO محسّن (Open Graph, Twitter Cards)
- ✅ بدون Backend أو Auth أو Payment Gateway
- ✅ سهل التخصيص والنسخ لعملاء آخرين

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

افتح [http://localhost:3005](http://localhost:3005) في المتصفح.

> **ملاحظة:** المشروع يعمل على المنفذ 3005 افتراضيًا.

## 🎨 التخصيص

> **💡 نصيحة:** راجع ملف `QUICK_START.md` لدليل سريع ومفصل للتخصيص.

### تغيير بيانات المتجر

عدّل ملف `data/store-config.json`:
- `storeName`: اسم المتجر
- `whatsappNumber`: رقم واتساب (بدون + أو مسافات)
- `instagram`: رابط إنستغرام (اختياري)
- `facebook`: رابط فيسبوك (اختياري)

### إضافة/تعديل العطور

عدّل ملف `data/perfumes.json`:
- أضف أو عدّل بيانات العطور
- كل عطر يحتوي على: `id`, `name`, `description`, `image`, `sizes`
- الحجم: `sizes` مصفوفة تحتوي على `size` و `price`

### تغيير الصور

1. ضع صور العطور في مجلد `public/images/`
2. عدّل مسارات الصور في `data/perfumes.json` لتطابق أسماء الملفات
3. الحجم الموصى به: 800x800 بكسل، أقل من 500KB

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

## 📦 البنية

```
perfume-store-mvp/
├── app/
│   ├── layout.tsx          # Layout الرئيسي + SEO
│   ├── page.tsx            # الصفحة الرئيسية
│   └── globals.css         # الأنماط العامة + الألوان
├── components/
│   ├── Hero.tsx            # قسم Hero
│   ├── ProductListing.tsx  # قائمة المنتجات (Grid + Carousel)
│   ├── ProductCard.tsx     # بطاقة المنتج
│   ├── ProductModal.tsx    # نافذة تفاصيل المنتج
│   ├── ProductCarousel.tsx # Carousel للعطور
│   ├── HowToOrder.tsx      # قسم "كيف تطلب عطرك؟"
│   ├── TrustSection.tsx    # قسم الثقة
│   ├── FAQ.tsx             # الأسئلة الشائعة
│   └── Footer.tsx          # التذييل
├── data/
│   ├── perfumes.json       # بيانات العطور
│   └── store-config.json   # إعدادات المتجر
├── lib/
│   └── config.ts           # Utility لاستيراد الإعدادات
└── public/
    └── images/             # صور المنتجات
```

## 🚀 النشر (Deployment)

### Vercel (موصى به - مجاني):

1. ارفع المشروع على GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط "New Project" → اختر المشروع
4. اضغط "Deploy"

**ملاحظة:** Vercel يكتشف Next.js تلقائيًا ولا يحتاج إعدادات إضافية.

### بدائل أخرى:
- Netlify
- Railway
- أي خدمة استضافة تدعم Next.js

## 📝 ملاحظات مهمة

- ✅ هذا مشروع **MVP مبسط** للعرض على العملاء
- ✅ البيانات **ثابتة (Static)** ولا تحتاج Backend
- ✅ **سهل التخصيص** والنسخ لعملاء آخرين
- ✅ يمكن ترقيته لاحقًا إلى نسخة كاملة مع Backend و Payment Gateway
- ✅ **جاهز للبيع مباشرة** - لا يحتاج تعديلات تقنية

## 🎯 للمطورين

- **TypeScript:** مكتوب بالكامل بـ TypeScript
- **CSS Modules:** كل مكون له ملف CSS منفصل
- **Next.js 14:** App Router
- **Swiper.js:** للـ Carousel
- **Responsive:** Mobile First Design

## 📞 الدعم

- **للمطورين الجدد**: راجع `DEVELOPER_DOCUMENTATION.md` للتوثيق الشامل
- **للبدء السريع**: راجع `QUICK_START_GUIDE.md` للبدء في 5 دقائق
- **للتخصيص**: راجع `QUICK_START.md` لدليل التخصيص السريع

