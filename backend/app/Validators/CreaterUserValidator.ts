import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreaterUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    username: schema.string({}),
    password: schema.string({}, [rules.minLength(4)]),
    email: schema.string({}, [rules.email()]),
  })
  public messages: CustomMessages = {}
}
