import Cta from "@/components/Cta"
import FeaturedJobs from "@/components/FeaturedJobs"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/hero"
import Navbar from "@/components/Navbar"
import Pricing from "@/components/Pricing"
export default function Page() {
  return (
    <>
      <main className="relative isolate min-h-screen bg-black">
        <Navbar />
        <Hero />
        <FeaturedJobs />
        <Features />
        <Pricing />
        <Cta />
        <Footer />
      </main>
    </>
  )
}
