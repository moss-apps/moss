import { z } from "zod"

// Zod's JIT schema compiler calls Function(""), which trips our CSP. Must run before any z.object().
z.config({ jitless: true })
