import Hero from '@/components/Hero'
import ProductListing from '@/components/ProductListing'
import HowToOrder from '@/components/HowToOrder'
import TrustSection from '@/components/TrustSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

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

