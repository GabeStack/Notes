import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class BadRequestException extends Exception {
  static status = 400
  static code = 'E_BAD_REQUEST'

  handle(error: this, { response }: HttpContext) {
    return response.badRequest({
      code: error.code,
      message: error.message,
    })
  }

  report(error: this, { logger, request }: HttpContext) {
    logger.warn(
      {
        code: error.code,
        status: error.status,
        method: request.method(),
        url: request.url(),
      },
      error.message
    )
  }
}