import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateRouteValidator {
  public schema = schema.create({
    name: schema.string({}, [rules.minLength(3)]),
    method: schema.enum(['get', 'post', 'put', 'delete', 'patch']),
    endpoint: schema.string({}, [rules.regex(new RegExp('^\\/([^/]*[^/]|)$'))]),
    enabled: schema.boolean(),
  })

  public messages: CustomMessages = {
    'name.required': 'Se necesita una pequeña descripción para la ruta',
    'name.minLength': 'Es necesario que el nombre tenga como mínimo 3 carácteres',
    'method.required': 'Es necesario especificar un verbo HTTP',
    'method.enum': 'No es un verbo válido.',
    'endpoint.required': 'Es necesaria la URL del endpoint a crear',
    'endpoint.regex': 'El endpoint debe comenzar con / y no terminar en /',
    'enabled.required': 'Tienes que indicar el estado de la ruta',
  }
}
