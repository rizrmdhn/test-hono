// import zod untuk validasi skema
import { z } from 'zod'

// Skema registrasi dengan pesan error custom (Bahasa Indonesia)
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Nama wajib diisi')
        .max(100, 'Nama maksimal 100 karakter'),

    username: z
        .string()
        .trim()
        .min(3, 'Username minimal 3 karakter')
        .max(32, 'Username maksimal 32 karakter')
        .regex(/^[a-z0-9_]+$/i, 'Username hanya boleh mengandung huruf, angka, dan underscore'),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Format email tidak valid'),

    password: z
        .string()
        .min(6, 'Password minimal 6 karakter')
        .max(128, 'Password maksimal 128 karakter'),
})

// Skema login dengan pesan error custom (Bahasa Indonesia)
export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, 'Username minimal 3 karakter')
        .max(32, 'Username maksimal 32 karakter'),

    password: z
        .string()
        .min(6, 'Password minimal 6 karakter'),
})