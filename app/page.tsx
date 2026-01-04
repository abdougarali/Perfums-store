import dynamic from 'next/dynamic'

// Lazy load all components for better performance
// Header is critical - load immediately but with SSR
const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <div style={{ minHeight: '80px' }} />,
  ssr: true, // Enable SSR for Header (critical above the fold)
})

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

