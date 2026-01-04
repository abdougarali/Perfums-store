import dynamic from 'next/dynamic'

// Import Header directly (critical above the fold)
import Header from '@/components/Header'

// ProductListing is critical - load immediately but with SSR
const ProductListing = dynamic(() => import('@/components/ProductListing'), {
  loading: () => <div style={{ minHeight: '400px', padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>,
  ssr: true, // Enable SSR for ProductListing (critical above the fold)
})

const HowToOrder = dynamic(() => import('@/components/HowToOrder'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
  ssr: false,
})

const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
  ssr: false,
})

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
  ssr: false,
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div style={{ minHeight: '100px' }} />,
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <Header />
      <ProductListing />
      <HowToOrder />
      <TrustSection />
      <FAQ />
      <Footer />
    </main>
  )
}

