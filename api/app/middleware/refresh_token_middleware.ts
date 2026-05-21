// app/middleware/refresh_token_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class RefreshTokenMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user as InstanceType<typeof User> | undefined

    // Estende ANTES de processar a requisição
    if (user?.currentAccessToken) {
      const newExpiry = DateTime.now().plus({ hours: 3 })

      await db
        .from('auth_access_tokens')
        .where('id', user.currentAccessToken.identifier.toString())
        .update({ expires_at: newExpiry.toSQL() })

      // Devolve a nova expiração pro frontend (opcional)
      response.header('X-Token-Expires-At', newExpiry.toISO())
    }

    await next()
  }
}
