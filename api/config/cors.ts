
import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: ["https://notes.gabestack.dev", 'http://localhost:5173'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  credentials: true,
  maxAge: 90,
})

export default corsConfig