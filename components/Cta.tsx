import Image from "next/image"
import Link from "next/link"

export default function Cta() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-4 pt-20 pb-14 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
      {/* Glow + grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_70%_60%_at_50%_8%,rgba(79,70,229,0.55),rgba(49,46,129,0.22)_48%,transparent_75%)] sm:h-[620px]" />
        <div className="absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black_0%,black_48%,transparent_76%)] sm:h-[640px]">
          <Image
            src="/images/cta-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-30 mix-blend-screen [filter:invert(1)_sepia(1)_saturate(4)_hue-rotate(215deg)]"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Your next role is
          <span className="block">already looking for you</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
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
    </section>
  )
}
