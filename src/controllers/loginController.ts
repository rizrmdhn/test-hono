
// import type Context dari Hono
import type { Context } from 'hono'

// import prisma client
import prisma from '../../prisma/client'

// import type Loginrequest
import type { LoginRequest } from '../types/auth'

// import sign dari Hono JWT helper
import { sign } from 'hono/jwt'

export const login = async (c: Context) => {
    try {
        const { username, password } = c.get('validatedBody') as LoginRequest

        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: 'Username atau password salah',
                },
                401
            )
        }

         const isPasswordValid = user.password 
            ? await Bun.password.verify(password, user.password)
            : false

        if (!isPasswordValid) {
            return c.json(
                {
                    success: false,
                    message: 'Password salah',
                },
                401
            )
        }

        // payload JWT dan sign token
        const payload = {
            sub: user.id,   
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
        }

        const secret = process.env.JWT_SECRET || 'default'

        const token = await sign(payload, secret)

        const {password: _, ...userData} = user

        return c.json(
            {
                success: true,
                message: 'Login Berhasil!',
                data: {
                    user: userData,
                    token: token,
                },
            },
            200
        )
    } catch (error) {
        // return internal server error
        return c.json({ success: false, message: 'Internal server error' }, 500)
    }
}

