import { NextRequest, NextResponse } from 'next/server'
import { ref, get, set } from 'firebase/database'
import { db, isFirebaseAvailable } from '@/lib/firebase'
import perfumesDataStatic from '@/data/perfumes.json'

// GET: قراءة المنتجات
export async function GET() {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable() || !db) {
      // Return static data if Firebase is not configured
      return NextResponse.json(perfumesDataStatic)
    }

    const snapshot = await get(ref(db, 'products'))
    const products = snapshot.val() || []
    
    // Convert object to array if needed
    const productsArray = Array.isArray(products) 
      ? products 
      : Object.values(products)
    
    // Return Firebase data if available, otherwise return static data
    return NextResponse.json(productsArray.length > 0 ? productsArray : perfumesDataStatic)
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to static data on error
    return NextResponse.json(perfumesDataStatic)
  }
}

// POST: حفظ المنتجات
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable() || !db) {
      return NextResponse.json(
        { error: 'Firebase not configured. Please set up Firebase environment variables.' },
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
