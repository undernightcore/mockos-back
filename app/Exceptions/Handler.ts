import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
  public async handle(error: any, ctx: HttpContextContract) {
    const code = error.status ?? 500
    const messages = error.messages?.errors?.map((e) => e.message) ?? [error.message]
    Logger.info(error)
    return ctx.response.status(code).send({
      errors: code === 500 || !messages ? 'Error inesperado' : messages,
    })
  }
}
