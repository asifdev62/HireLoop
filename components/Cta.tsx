import Image from "next/image"
import Link from "next/link"

export default function Cta() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      {/* The glow is clipped to this centered box, so everything around it
          stays pure black instead of the dome bleeding to the viewport edges. */}
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden">
        {/* Round planet backdrop: a purple dome with a faint grid. Both layers
            fade to transparent before the box ends, so the clip never leaves a
            hard edge behind. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_62%_at_50%_22%,rgba(139,120,255,0.7),rgba(92,83,254,0.42)_38%,rgba(49,46,129,0.2)_60%,transparent_80%)]" />
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_92%)]">
            <Image
              src="/images/cta-bg.png"
              alt=""
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover object-top opacity-50 mix-blend-screen [filter:invert(1)_sepia(1)_saturate(7)_hue-rotate(215deg)]"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-2 pt-16 pb-20 text-center sm:px-6 sm:pt-24 sm:pb-28">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next role is
            <span className="block">already looking for you</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none sm:w-auto"
            >
              Create a free account
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none sm:w-auto"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
