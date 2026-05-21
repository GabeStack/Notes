import { randomUUID } from 'node:crypto'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import encryption from '@adonisjs/core/services/encryption'
import BadRequestException from '#exceptions/bad_request_exception'

// Tipo do payload que vai dentro do token criptografado
export type ResetTokenPayload = {
  userId: number
  email: string
  jti: string
  expiresAt: number
  purpose: 'password_reset'
}

export class PasswordService {
  // Tempo de validade do token (15 minutos em milissegundos)
  private readonly tokenTtlMs = 15 * 60 * 1000

  /**
   * Gera o token criptografado e envia o email
   */
  public async sendForgotPassword(email: string) {
    console.log(`🔍 [Service] Iniciando fluxo para: ${email}`)

    const user = await User.findBy('email', email)

    // ⚠️ Por segurança, não revelamos se o email existe ou não
    if (!user) {
      console.log(`⚠️ [Service] Tentativa de recuperação para email não cadastrado: ${email}`)
      return // Retorna silenciosamente para não vazar dados
    }

    console.log(`✅ [Service] Usuário encontrado (ID: ${user.id})`)

    // Dados do payload
    const expiresAt = Date.now() + this.tokenTtlMs
    const jti = randomUUID() // ID único para auditoria/logs

    // Criptografa os dados para gerar o token seguro
    const token = encryption.encrypt({
      userId: user.id,
      email: user.email,
      jti,
      expiresAt,
      purpose: 'password_reset',
    } as ResetTokenPayload)

    const resetUrl = `https://notes.gabestack.dev/reset-password?token=${encodeURIComponent(token)}`

    try {
      await mail.send((message) => {
        message
          .from('noreply@gabestack.dev')
          .to(user.email)
          .subject('Recuperação de senha')
          .htmlView('emails/forgot_password', {
            name: user.fullName ?? 'Usuário',
            resetUrl,
            expiresIn: '15 minutos',
          })
      })
    } catch (mailError: any) {
      console.error('❌ [Service] Erro ao enviar email:', mailError.message)
      // Decide se quer propagar o erro ou não. 
      // Geralmente em dev é bom propagar para ver o erro.
      throw mailError 
    }
  }

  /**
   * Valida o token e redefine a senha
   */
  public async resetPassword(token: string, newPassword: string) {
    let payload: ResetTokenPayload

    // 1️⃣ Tenta descriptografar o token
    try {
      payload = encryption.decrypt(token) as ResetTokenPayload
    } catch {
      throw new BadRequestException('Token inválido ou corrompido')
    }

    // 2️⃣ Valida estrutura e propósito
    if (!payload || payload.purpose !== 'password_reset') {
      throw new BadRequestException('Token inválido')
    }

    // 3️⃣ Valida expiração (substituindo a checagem que era feita no Redis)
    if (payload.expiresAt < Date.now()) {
      throw new BadRequestException('Token expirado. Solicite um novo link.')
    }

    // 4️⃣ Busca o usuário e valida consistência
    const user = await User.find(payload.userId)

    if (!user || user.email !== payload.email) {
      throw new BadRequestException('Usuário não encontrado ou token incompatível')
    }

    // 5️⃣ Atualiza a senha
    user.password = newPassword
    await user.save()

  }
}

const passwordService = new PasswordService()
export default passwordService