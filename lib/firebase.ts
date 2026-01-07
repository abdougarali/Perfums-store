import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'
import { getStorage, FirebaseStorage } from 'firebase/storage'

let app: FirebaseApp | null = null
let db: Database | null = null
let storage: FirebaseStorage | null = null

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )
}

// Initialize Firebase function - works on both server and client
const initializeFirebase = () => {
  if (!isFirebaseConfigured()) {
    return
  }

  try {
    // Use existing app if available
    if (getApps().length === 0) {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    // Initialize Realtime Database
    db = getDatabase(app)

    // Initialize Storage (if configured)
    if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      storage = getStorage(app)
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    // Don't throw, allow app to continue without Firebase
  }
}

// Initialize Firebase immediately for server-side (API routes)
// For client-side, we can defer initialization to reduce bundle impact
if (typeof window === 'undefined') {
  // Server-side: Initialize immediately
  initializeFirebase()
} else {
  // Client-side: Initialize immediately (needed for API calls from client)
  initializeFirebase()
}

export { db, storage }

// Helper function to check if Firebase is available
// This will also try to initialize Firebase if not already initialized
export const isFirebaseAvailable = () => {
  if (!isFirebaseConfigured()) {
    return false
  }
  
  // If Firebase is configured but not initialized, try to initialize it
  if (db === null) {
    initializeFirebase()
  }
  
  return db !== null
}
