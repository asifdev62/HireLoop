import { Navbar } from "@/components/navbar"

export default function Page() {
  return (
    <div className="relative min-h-svh bg-[#0a0a0b] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.16),transparent_65%)]"
      />

      <Navbar />
    </div>
    
  )
}
