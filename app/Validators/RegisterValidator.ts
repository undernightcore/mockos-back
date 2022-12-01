import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    name: schema.string({}, [rules.minLength(3)]),
    password: schema.string({}, [rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'email.required': 'Necesitamos un correo para poder registrarte.',
    'email.unique': 'Ya tienes una cuenta con este correo.',
    'email.email': 'Este correo no es valido.',
    'name.required': 'Necesitamos un nombre para saber como dirigirnos a ti',
    'password.required': 'Necesitamos una contraseña para poderte dar acceso.',
    'password.minLength': 'Porfa, usa una contraseña de al menos 8 caracteres.',
  }
}
