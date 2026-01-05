'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
}

/**
 * LazySection - Component that loads children only when they enter viewport
 * Uses Intersection Observer for better performance
 */
export default function LazySection({ 
  children, 
  fallback = null,
  rootMargin = '100px' // Start loading 100px before entering viewport
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || hasLoaded) return

    // Use Intersection Observer to detect when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setHasLoaded(true)
            observer.disconnect() // Stop observing once loaded
          }
        })
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger when 1% of element is visible
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, hasLoaded])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}
