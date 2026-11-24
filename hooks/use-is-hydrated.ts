import * as React from "react"

// There is nothing to subscribe to: the value only changes once, when React
// takes over the server-rendered HTML.
const subscribe = () => () => {}

/**
 * `false` while rendering on the server and during the first client render,
 * `true` after hydration.
 *
 * Used to keep the auth forms' submit button inert until its submit handler is
 * attached: a click before hydration would otherwise fall back to a native
 * form GET and put the password in the URL.
 */
export function useIsHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
