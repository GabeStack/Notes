import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ fullName, email, password })
    const token = await User.accessTokens.create(user)

          await mail.send((message) => {
        message
          .from('noreply@gabestack.dev')
          .to(user.email)
          .subject('Bem-Vindo ao Corenotes')
          .htmlView('emails/welcome', {
            name: user.fullName ?? 'Usuário',
            appName: "Corenotes"
          })
      })

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
