import dynamic from 'next/dynamic'
import LazySection from '@/components/LazySection'

// Import Header directly (critical above the fold)
import Header from '@/components/Header'

// ProductListing is critical - load immediately but with SSR
const ProductListing = dynamic(() => import('@/components/ProductListing'), {
  loading: () => <div style={{ minHeight: '400px', padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>,
  ssr: true, // Enable SSR for ProductListing (critical above the fold)
})

// Lazy load below-the-fold components - only load when in viewport
const HowToOrder = dynamic(() => import('@/components/HowToOrder'), {
  ssr: false,
})

const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  ssr: false,
})

const FAQ = dynamic(() => import('@/components/FAQ'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <Header />
      <ProductListing />
      <LazySection fallback={<div style={{ minHeight: '200px' }} />}>
        <HowToOrder />
      </LazySection>
      <LazySection fallback={<div style={{ minHeight: '200px' }} />}>
        <TrustSection />
      </LazySection>
      <LazySection fallback={<div style={{ minHeight: '200px' }} />}>
        <FAQ />
      </LazySection>
      <LazySection fallback={<div style={{ minHeight: '100px' }} />}>
        <Footer />
      </LazySection>
    </main>
  )
}

