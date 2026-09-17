import { isKnownRoute } from "./src/lib/routes"

const PASSTHROUGH = [/^\/api\//, /^\/assets\//, /\.[^/]+$/]

export const config = {
  matcher: ["/((?!api/|assets/|.*\\.[^/]+$).*)"],
}

export default async function middleware(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") return

  const { pathname } = new URL(request.url)
  if (PASSTHROUGH.some((pattern) => pattern.test(pathname))) return
  if (isKnownRoute(pathname)) return

  const index = await fetch(new URL("/index.html", request.url))

  return new Response(index.body, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  })
}
