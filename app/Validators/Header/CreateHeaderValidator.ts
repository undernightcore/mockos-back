import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateHeaderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    key: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.unique({
        table: 'headers',
        column: 'key',
        where: { response_id: this.ctx.params.id },
      }),
    ]),
    value: schema.string({ trim: true }, [rules.maxLength(255)]),
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('validator.header.create')
}
