import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseAvailable } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      return NextResponse.json(
        { 
          error: 'Firebase is not configured. Please set up Firebase in environment variables.',
        },
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
        { error: 'File must be an image', details: `File type: ${file.type}` },
        { status: 400 }
      )
    }

    // File is already compressed in the browser, just validate size
    const originalSize = file.size
    console.log('Received image (already compressed):', {
      fileName: file.name,
      size: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
      type: file.type
    })

    // Validate final file size (max 2MB for Base64 - to avoid database size issues)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: 'File is too large after compression', 
          details: `Maximum size is 2MB for Base64 storage. Your file is ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB. Please use a smaller image.` 
        },
        { status: 400 }
      )
    }

    // Convert image to Base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    console.log('Image converted to Base64:', {
      fileName: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      base64Length: base64.length
    })
    
    // Return Base64 data URL (will be saved directly in Realtime Database)
    return NextResponse.json({ 
      url: dataUrl, 
      fileName: file.name,
      isBase64: true
    })
  } catch (error: any) {
    console.error('Error processing image:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process image',
        details: error?.message || 'Unknown error occurred while processing image.',
        fullError: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
