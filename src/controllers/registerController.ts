
// import type Context dari Hono
import type { Context } from 'hono'

// import prisma client
import prisma from '../../prisma/client'

// import type RegisterRequest
import type { RegisterRequest } from '../types/auth'

export const register =async (c: Context) => {
    try {
        const { name, username, email, password } = await c.get('validatedBody') as RegisterRequest

    const existing = await prisma.user.findFirst({
        where: {
            OR: [{email}, {username}]
        },
        select: {
            id: true,
            email: true,
            username: true
        }
    })

    if (existing) {
        const conflictField = existing.email === email ? 'email' : existing.username === username ? 'username' : 'email'
        return c.json(
                {
                    success: false,
                    message:
                        conflictField === 'email'
                            ? 'Email sudah terdaftar'
                            : 'Username sudah digunakan',
                    errors: { [conflictField]: 'Telah digunakan' },
                },
                409
            )
    }
    
    // Hash password (Bun gunakan Argon2id secara default)
        const hashedPassword = await Bun.password.hash(password)

        // Buat user baru (jangan expose password di select)
        const user = await prisma.user.create({
            data: { name, username, email, password: hashedPassword },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        // return response sukses 201
        return c.json(
            {
                success: true,
                message: 'User Berhasil Dibuat',
                data: user,
            },
            201
        )

    } catch (error) {
          // return internal server error
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
} 