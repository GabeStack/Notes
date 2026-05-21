// commands/test_smtp.ts
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import mail from '@adonisjs/mail/services/main'

export default class TestSmtp extends BaseCommand {
  static commandName = 'test:smtp'
  static description = 'Testa conexão SMTP'

  // 🔑 CRÍTICO: Inicia o container do AdonisJS para carregar os serviços
  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      this.logger.info('🔌 Tentando conectar ao SMTP...')

      await mail.send((message) => {
        message
          .from('noreply@gabestack.dev')
          .to('seu-email-real@gmail.com') // ← TROQUE PELO SEU EMAIL
          .subject('Teste de conexão SMTP')
          .text('Se recebeu este email, o SMTP está funcionando! ✅')
      })

      this.logger.success('✅ Email enviado com sucesso!')
    } catch (error: any) {
      this.logger.error('❌ Falha ao enviar email')
      this.logger.error(`Erro: ${error.message}`)
      if (error.response) this.logger.error(`Resposta SMTP: ${error.response}`)
      if (error.code) this.logger.error(`Código: ${error.code}`)
      if (error.stack) this.logger.debug(error.stack)
    }
  }
}