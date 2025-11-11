// import z dari zod untuk tipe ZodError
import { z } from 'zod'

// Tipe hasil error per-field
export type ValidationErrors = Record<string, string>

/**
 * Mengubah ZodError (atau objek error serupa) menjadi map { field: message }
 * - Ambil satu pesan per field (first message)
 * - Jika ada form-level error (tanpa path), simpan di key 'form'
 */
export function formatZodErrors(err: unknown): ValidationErrors {
  const errors: ValidationErrors = {}

  // Kasus ZodError asli
  if (err instanceof z.ZodError) {
    for (const issue of err.issues) {
      const path = issue.path?.join('.') || 'form'
      if (!errors[path]) errors[path] = issue.message
    }
    return errors
  }

  // Kasus object yang "mirip" ZodError (mis. dari lib lain yang punya .issues)
  if (typeof err === 'object' && err !== null && 'issues' in err) {
    const anyErr = err as { issues?: Array<{ path?: (string | number)[]; message?: string }> }
    for (const issue of anyErr.issues ?? []) {
      const path = issue?.path?.join('.') || 'form'
      const message = issue?.message || 'Invalid input'
      if (!errors[path]) errors[path] = message
    }
    return errors
  }

  // Fallback (bukan error validasi yang dikenali)
  errors.form = 'Validation failed'
  return errors
}