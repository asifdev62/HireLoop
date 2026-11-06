import Hero from "@/components/hero"
import Navbar from "@/components/Navbar"

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0a0b]">
        <Navbar />
        <Hero />
      </main>
    </>
  )
}
