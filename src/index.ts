import { Hono } from 'hono'

//import routes
import { Routes } from './routes'

// import cors bawaan dari Hono
import { cors } from 'hono/cors'

// instansiasi Hono
const app = new Hono().basePath('/api')

// aktifkan CORS middleware untuk semua endpoint
app.use('*', cors())

// Use the imported routes
app.route('/', Routes)

export default app