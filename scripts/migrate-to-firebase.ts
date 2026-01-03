/**
 * Migration Script: نقل البيانات من JSON إلى Firebase
 * 
 * الاستخدام:
 * 1. تأكد من إعداد .env.local مع Firebase Config
 * 2. شغّل: npm run migrate:firebase
 */

// Load environment variables from .env.local
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import { ref, set } from 'firebase/database'
import { db, isFirebaseAvailable } from '../lib/firebase'
import perfumesData from '../data/perfumes.json'
import storeConfig from '../data/store-config.json'

async function migrate() {
  try {
    console.log('🚀 بدء نقل البيانات إلى Firebase...\n')

    // التحقق من إعداد Firebase
    if (!isFirebaseAvailable() || !db) {
      console.error('❌ خطأ: Firebase غير مُعدّ. تأكد من إعداد .env.local')
      console.error('   تأكد من وجود جميع متغيرات Firebase في .env.local')
      process.exit(1)
    }

    // نقل المنتجات
    console.log('📦 نقل المنتجات...')
    await set(ref(db, 'products'), perfumesData)
    console.log(`✅ تم نقل ${perfumesData.length} منتج بنجاح\n`)

    // نقل الإعدادات
    console.log('⚙️  نقل إعدادات المتجر...')
    await set(ref(db, 'config'), storeConfig)
    console.log('✅ تم نقل الإعدادات بنجاح\n')

    console.log('🎉 اكتمل النقل بنجاح!')
    console.log('\n📝 الخطوات التالية:')
    console.log('1. افتح Firebase Console وتحقق من البيانات')
    console.log('2. شغّل المشروع: npm run dev')
    console.log('3. افتح صفحة Admin: http://localhost:3005/admin')
  } catch (error) {
    console.error('❌ خطأ أثناء النقل:', error)
    process.exit(1)
  }
}

migrate()
