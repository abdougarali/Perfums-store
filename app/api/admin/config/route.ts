import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db } from '@/lib/firebase'

// GET: قراءة الإعدادات
export async function GET() {
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const snapshot = await get(ref(db, 'config'))
    const config = snapshot.val() || {}
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

// POST: حفظ الإعدادات
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
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
