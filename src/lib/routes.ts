const STATIC_ROUTES = [
  "/",
  "/changelog",
  "/downloads",
  "/announcements",
  "/community",
  "/flick",
  "/latch",
  "/contact",
  "/search",
  "/admin",
]

const DYNAMIC_ROUTES = [/^\/announcements\/[^/]+$/, /^\/community\/[^/]+$/]

export function isKnownRoute(pathname: string): boolean {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname
  if (STATIC_ROUTES.includes(path)) return true
  return DYNAMIC_ROUTES.some((re) => re.test(path))
}
