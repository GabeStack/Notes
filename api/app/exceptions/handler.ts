import app from '@adonisjs/core/services/app'
import { ExceptionHandler } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    await super.report(error, ctx)

    if (typeof error === 'object' && error && 'status' in error) {
      const err = error as { status?: number; message?: string; code?: string }

      if (err.status === 422) {
        ctx.logger.warn(
          {
            code: err.code,
            status: err.status,
            method: ctx.request.method(),
            url: ctx.request.url(),
          },
          err.message || 'Validation failed'
        )
      }
    }
  }
}