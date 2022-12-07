import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.minLength(3),
      rules.unique({ table: 'projects', column: 'name' }),
    ]),
    description: schema.string.nullable({}, [rules.minLength(3)]),
  })

  public messages: CustomMessages = {
    'name.required': 'Necesito un nombre para el proyecto',
    'name.unique': 'Ya existe un proyecto con este nombre',
    'name.minLength': 'El nombre debe tener como mínimo 3 carácteres',
    'description.minLength': 'La descripción debe tener como mínimo 3 caracteres',
    'description.nullable':
      'Es necesaria una descripción, si no quieres enviar una puede pasar null',
  }
}
