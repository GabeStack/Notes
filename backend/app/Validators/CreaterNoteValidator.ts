import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreaterNoteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({}),
    describe: schema.string({}),
    favorite: schema.boolean(),
    color: schema.string({}),
  })

  public messages: CustomMessages = {}
}
