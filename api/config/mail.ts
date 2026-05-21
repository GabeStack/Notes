import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: env.get('MAIL_MAILER'),
  from: {
    address: env.get('MAIL_FROM_ADDRESS'),
    name: env.get('MAIL_FROM_NAME'),
  },

  globals: {
    brandName: 'Acme',
  },

  mailers: {
    smtp: transports.smtp({
      host: 'mail.gabestack.dev',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        type: 'login',
        user: String(env.get('SMTP_USERNAME')),
        pass: String(env.get('SMTP_PASSWORD')),
      },
      tls: {
        servername: env.get('SMTP_HOST'),
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
