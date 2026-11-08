import Cta from "@/components/Cta"
import Footer from "@/components/Footer"
import Hero from "@/components/hero"
import Navbar from "@/components/Navbar"
export default function Page() {
  return (
    <>
      <main className="relative isolate min-h-screen bg-black">
        <Navbar />
        <Hero />
        <Cta />
        <Footer />
      </main>
    </>
  )
}
