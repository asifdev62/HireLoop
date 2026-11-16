import Cta from "@/components/Cta"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/hero"
import Navbar from "@/components/Navbar"
export default function Page() {
  return (
    <>
      <main className="relative isolate min-h-screen bg-black">
        <Navbar />
        <Hero />
        <Features />
        <Cta />
        <Footer />
      </main>
    </>
  )
}
