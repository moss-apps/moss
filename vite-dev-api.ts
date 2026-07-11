import type { Plugin } from "vite"
import { loadEnv } from "vite"
import type { IncomingMessage, ServerResponse } from "node:http"

type Headers = Record<string, string | string[] | undefined>

interface ApiRequest {
  method?: string
  headers: Headers
  body: Record<string, unknown> | string | undefined
  query: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  status(code: number): ApiResponse
  json(data: unknown): ApiResponse
  setHeader(key: string, value: string | string[]): ApiResponse
  end(data?: string): ApiResponse
}

const ROUTES: Record<string, string> = {
  "/api/admin/auth": "/api/admin/auth.ts",
  "/api/admin/announcements": "/api/admin/announcements.ts",
  "/api/admin/announcements/upload-url": "/api/admin/announcements/upload-url.ts",
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ""
    req.on("data", (c) => (data += c))
    req.on("end", () => resolve(data))
    req.on("error", reject)
  })
}

export function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), "")
      for (const [k, v] of Object.entries(env)) {
        if (!process.env[k]) process.env[k] = v
      }
    },
    configureServer(server) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
          const rawUrl = req.url || ""
          if (!rawUrl.startsWith("/api/")) return next()

          const parsed = new URL(rawUrl, "http://localhost")
          const handlerFile = ROUTES[parsed.pathname]
          if (!handlerFile) {
            res.statusCode = 404
            res.setHeader("content-type", "application/json")
            res.end(JSON.stringify({ error: "Not found" }))
            return
          }

          const bodyStr = await readBody(req)
          let body: ApiRequest["body"]
          try {
            body = bodyStr ? JSON.parse(bodyStr) : undefined
          } catch {
            body = bodyStr || undefined
          }

          const query: Record<string, string | string[]> = {}
          parsed.searchParams.forEach((v, k) => {
            const ex = query[k]
            query[k] = ex
              ? Array.isArray(ex)
                ? [...ex, v]
                : [ex, v]
              : v
          })

          const apiReq: ApiRequest = {
            method: req.method,
            headers: req.headers as Headers,
            body,
            query,
          }

          let status = 200
          const resHeaders: Headers = {}
          let resBody = ""

          const apiRes: ApiResponse = {
            status(c: number) {
              status = c
              return apiRes
            },
            json(d: unknown) {
              resHeaders["content-type"] = "application/json"
              resBody = JSON.stringify(d)
              return apiRes
            },
            setHeader(k: string, v: string | string[]) {
              resHeaders[k] = v
              return apiRes
            },
            end(d?: string) {
              resBody = d ?? ""
              return apiRes
            },
          }

          try {
            const mod = await server.ssrLoadModule(handlerFile)
            await mod.default(apiReq, apiRes)
          } catch (err) {
            console.error("[dev-api]", err)
            status = 500
            resHeaders["content-type"] = "application/json"
            resBody = JSON.stringify({
              error: err instanceof Error ? err.message : "Internal server error",
            })
          }

          res.statusCode = status
          for (const [k, v] of Object.entries(resHeaders)) {
            if (v !== undefined) res.setHeader(k, v as string | readonly string[])
          }
          res.end(resBody)
        },
      )
    },
  }
}
