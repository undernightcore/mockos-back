import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditPostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(3)]),
    description: schema.string.optional({}, [rules.minLength(3)]),
  })
  public messages: CustomMessages = {
    'name.required': 'Necesito un nombre a modificar',
    'description.minlength': 'La descripción debe tener como mínimo 3 caracteres',
  }
}
