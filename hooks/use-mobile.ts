import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Always start with `false` so the server and the first client render match.
  // The real value is applied after mount in the effect below.
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)
    onChange()

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
