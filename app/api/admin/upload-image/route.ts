import { NextRequest, NextResponse } from 'next/server'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, isFirebaseAvailable } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Storage is available
    if (!isFirebaseAvailable() || !storage) {
      return NextResponse.json(
        { error: 'Firebase Storage is not configured. Please set up Firebase environment variables.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Upload image to Firebase Storage
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const storageRef = ref(storage, `images/${fileName}`)
    
    const bytes = await file.arrayBuffer()
    await uploadBytes(storageRef, bytes)
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef)
    
    return NextResponse.json({ url: downloadURL, fileName })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
