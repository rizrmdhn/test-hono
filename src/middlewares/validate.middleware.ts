// import zod
import { z } from 'zod'

// import type MiddlewareHandler dari hono
import type { MiddlewareHandler } from 'hono'

// import formatZodErrors dari utils
import { formatZodErrors } from '../utils/validation'

export function validateBody<T extends z.ZodTypeAny>(schema: T): MiddlewareHandler {
    return async (c, next) => {
        // Wajib JSON
        const ct = c.req.header('content-type') || ''
        if (!ct.toLowerCase().includes('application/json')) {
            return c.json(
                { success: false, message: 'Unsupported Media Type: use application/json' },
                415
            )
        }

        // Parse body aman
        let raw: unknown
        try {
            raw = await c.req.json()
        } catch {
            return c.json(
                { success: false, message: 'Invalid JSON payload' },
                400
            )
        }

        // Validasi Zod (tanpa throw)
        const parsed = schema.safeParse(raw)
        if (!parsed.success) {
            return c.json(
                { success: false, message: 'Validation Failed!', errors: formatZodErrors(parsed.error) },
                422
            )
        }

        // simpan hasil validasi untuk controller
        c.set('validatedBody', parsed.data)
        await next()
    }
}