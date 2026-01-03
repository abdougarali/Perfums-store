import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db, isFirebaseAvailable } from '@/lib/firebase'
import storeConfigStatic from '@/data/store-config.json'

// GET: قراءة الإعدادات
export async function GET() {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable() || !db) {
      // Return static data if Firebase is not configured
      return NextResponse.json(storeConfigStatic)
    }

    const snapshot = await get(ref(db, 'config'))
    const config = snapshot.val() || {}
    
    // Return Firebase data if available, otherwise return static data
    return NextResponse.json(Object.keys(config).length > 0 ? config : storeConfigStatic)
  } catch (error) {
    console.error('Error fetching config:', error)
    // Fallback to static data on error
    return NextResponse.json(storeConfigStatic)
  }
}

// POST: حفظ الإعدادات
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable() || !db) {
      return NextResponse.json(
        { error: 'Firebase not configured. Please set up Firebase environment variables.' },
        { status: 500 }
      )
    }

    const config = await request.json()
    await set(ref(db, 'config'), config)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    )
  }
}
