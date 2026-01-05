'use client'

// Simple password protection - Password stored in .env.local
// ⚠️ WARNING: Using NEXT_PUBLIC_ makes password visible in browser (not secure for production)
// For production, use server-side authentication

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export const simpleAuth = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    const stored = sessionStorage.getItem('admin_authenticated')
    return stored === 'true'
  },

  // Login with password
  login: (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_authenticated', 'true')
      }
      return true
    }
    return false
  },

  // Logout
  logout: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_authenticated')
    }
  },
}
