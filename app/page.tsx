import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'

// Lazy load components below the fold to improve LCP
// Only Hero loads immediately (above the fold)
const ProductListing = dynamic(() => import('@/components/ProductListing'), {
  loading: () => <div style={{ minHeight: '400px' }} aria-hidden="true" />, // Prevent layout shift
})

const HowToOrder = dynamic(() => import('@/components/HowToOrder'), {
  loading: () => <div style={{ minHeight: '200px' }} aria-hidden="true" />,
})

const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  loading: () => <div style={{ minHeight: '150px' }} aria-hidden="true" />,
})

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div style={{ minHeight: '200px' }} aria-hidden="true" />,
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div style={{ minHeight: '200px' }} aria-hidden="true" />,
})

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductListing />
      <HowToOrder />
      <TrustSection />
      <FAQ />
      <Footer />
    </main>
  )
}

