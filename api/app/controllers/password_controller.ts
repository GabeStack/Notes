import type { HttpContext } from '@adonisjs/core/http'
import passwordService from '#services/password_service'

export default class PasswordController {
  public async forgotPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    await passwordService.sendForgotPassword(email)

    return response.noContent()
  }

  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    await passwordService.resetPassword(token, password)

    return response.noContent()
  }
}