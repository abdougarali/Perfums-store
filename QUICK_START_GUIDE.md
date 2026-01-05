# Quick Start Guide - دليل البدء السريع

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd perfume-store-mvp
npm install
```

### Step 2: Configure Firebase (Optional)

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

**Note**: The app works without Firebase (uses static JSON files).

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3005

### Step 4: Access Admin Panel

Navigate to http://localhost:3005/admin

---

## 📝 Common Tasks

### Update Store Information

**Option 1: Via Admin Panel**
1. Go to `/admin`
2. Click "Config" tab
3. Update store name, WhatsApp number, etc.
4. Click "حفظ جميع التغييرات"

**Option 2: Via JSON File**
Edit `data/store-config.json`:
```json
{
  "storeName": "اسم المتجر",
  "whatsappNumber": "21626010403",
  "instagram": "https://instagram.com/...",
  "facebook": "https://facebook.com/...",
  "googleAnalyticsId": "G-XXXXX",
  "generalWhatsAppMessage": "السلام عليكم..."
}
```

### Add/Edit Products

**Via Admin Panel**:
1. Go to `/admin` → "Products" tab
2. Click "إضافة منتج جديد" or edit existing product
3. Upload image (auto-compressed to WebP)
4. Add sizes and prices
5. Save

**Via JSON File**:
Edit `data/perfumes.json`:
```json
[
  {
    "id": "1",
    "name": "عطر الفخامة",
    "description": "عطر فاخر للرجال",
    "image": "/images/perfume1.png",
    "sizes": [
      { "size": "50ml", "price": 120 },
      { "size": "100ml", "price": 200 }
    ],
    "active": true
  }
]
```

### Change Images

1. Place images in `public/images/`
2. Update image path in product data
3. Recommended: 800x800px, <500KB, WebP format

### Deploy to Vercel

1. Push code to GitHub
2. Connect Vercel to repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically

---

## 🔧 Development Commands

```bash
npm run dev          # Start dev server (port 3005)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run analyze      # Analyze bundle size
```

---

## 📊 Project Structure Overview

```
app/              → Pages & API routes
components/       → React components
data/             → Static JSON data (fallback)
lib/              → Utilities & hooks
public/           → Static assets (images, icons)
```

---

## 🎯 Key Files to Know

- `app/page.tsx` - Homepage
- `app/admin/page.tsx` - Admin panel
- `data/perfumes.json` - Product data (fallback)
- `data/store-config.json` - Store config (fallback)
- `lib/firebase.ts` - Firebase setup
- `lib/useFirebaseData.ts` - Data fetching hooks
- `next.config.js` - Next.js configuration

---

## ⚠️ Important Notes

1. **Firebase is Optional**: App works with static JSON files
2. **Admin Panel**: No authentication (add in production)
3. **Images**: Currently stored as Base64 in Firebase
4. **Performance**: Optimized for 84+ PageSpeed score
5. **Port**: Development server runs on port 3005

---

## 🆘 Need Help?

- Read `DEVELOPER_DOCUMENTATION.md` for detailed info
- Check `README.md` for basic overview
- Review Firebase setup guides in project root

---

**Ready to go!** 🎉
