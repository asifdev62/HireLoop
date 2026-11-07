import Image from "next/image"
import Link from "next/link"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/ai" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "/salaries" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/career-library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
]

const linkClassName =
  "rounded-sm text-sm text-zinc-500 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.317 4.369A19.79 19.79 0 0 0 15.432 3a13.9 13.9 0 0 0-.64 1.3 18.27 18.27 0 0 0-5.583 0A13.9 13.9 0 0 0 8.57 3a19.74 19.74 0 0 0-4.886 1.372C.735 8.876-.081 13.27.327 17.605a19.9 19.9 0 0 0 6.007 3.043 14.4 14.4 0 0 0 1.284-2.09 12.9 12.9 0 0 1-2.022-.976c.17-.124.336-.253.496-.386a14.2 14.2 0 0 0 12.816 0c.161.133.327.262.497.386a12.9 12.9 0 0 1-2.024.977 14.4 14.4 0 0 0 1.285 2.089 19.86 19.86 0 0 0 6.009-3.043c.48-5.028-.817-9.383-3.361-13.236ZM8.02 15.09c-1.183 0-2.157-1.086-2.157-2.42 0-1.332.955-2.42 2.156-2.42 1.21 0 2.176 1.097 2.157 2.42 0 1.334-.955 2.42-2.156 2.42Zm7.96 0c-1.183 0-2.157-1.086-2.157-2.42 0-1.332.955-2.42 2.157-2.42 1.21 0 2.175 1.097 2.156 2.42 0 1.334-.946 2.42-2.156 2.42Z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0c10] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand column */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <Link
                href="/"
                aria-label="hireloop home"
                className="inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
              >
                <Image
                  src="/images/logo.png"
                  alt="hireloop"
                  width={154}
                  height={44}
                  className="h-9 w-auto"
                />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
                The AI-native career platform. Built for people who take their
                work seriously.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="hireloop on Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="hireloop on Discord"
                className="flex size-8 items-center justify-center rounded-full bg-[#5865f2] text-white transition-colors hover:bg-[#4752c4] focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
              >
                <DiscordIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="hireloop on LinkedIn"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
              >
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Links + legal */}
          <div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-sm font-semibold text-violet-400">
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className={linkClassName}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-3 text-xs text-zinc-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-6">
              <p>Copyright 2024 — programming hero</p>
              <div className="flex items-center gap-2">
                <Link href="/terms" className={linkClassName}>
                  Terms &amp; Policy
                </Link>
                <span aria-hidden="true">-</span>
                <Link href="/privacy" className={linkClassName}>
                  Privacy Guideline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
