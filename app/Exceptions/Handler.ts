import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
  public async handle(error: any, ctx: HttpContextContract) {
    return ctx.response.status(error.status ?? 500).send({
      errors: error.messages?.errors?.map((e) => e.message) ?? [error.message] ?? [
          'Ha habido un error',
        ],
    })
  }
}
