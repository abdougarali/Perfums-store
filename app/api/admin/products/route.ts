import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db } from '@/lib/firebase'

// GET: قراءة المنتجات
export async function GET() {
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const snapshot = await get(ref(db, 'products'))
    const products = snapshot.val() || []
    
    // Convert object to array if needed
    const productsArray = Array.isArray(products) 
      ? products 
      : Object.values(products)
    
    return NextResponse.json(productsArray)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST: حفظ المنتجات
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      )
    }

    const products = await request.json()
    
    // Validate products array
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products must be an array' },
        { status: 400 }
      )
    }

    await set(ref(db, 'products'), products)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving products:', error)
    return NextResponse.json(
      { error: 'Failed to save products' },
      { status: 500 }
    )
  }
}
