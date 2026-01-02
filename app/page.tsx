import Hero from '@/components/Hero'
import ProductListing from '@/components/ProductListing'
import dynamic from 'next/dynamic'

// Lazy load non-critical components below the fold
const HowToOrder = dynamic(() => import('@/components/HowToOrder'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div style={{ minHeight: '100px' }} />,
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

