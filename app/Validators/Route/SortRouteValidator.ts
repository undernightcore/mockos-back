import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class SortRouteValidator {
  public schema = schema.create({
    origin: schema.number(),
    destination: schema.number(),
  })

  public messages: CustomMessages = {
    'origin.required': 'Es necesario que indiques que ruta vas a mover',
    'destination.required': 'Es necesario que indiques donde vas a mover la ruta',
  }
}
