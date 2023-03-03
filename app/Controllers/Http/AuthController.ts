import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const user = await User.create(data)
    const verificationUrl = Route.makeSignedUrl('verifyEmail', {
      email: user.email,
    })
    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'))
        .to(user.email)
        .subject('¡Bienvenido a Mockos!')
        .text(`Porfi, verifica tu correo aquí ${Env.get('BACK_URL')}${verificationUrl}`)
    })
    return response.created({ message: `Holi ${user.name}, verifica tu correo electrónico porfa` })
  }

  public async verify({ request, response, params }: HttpContextContract) {
    if (!request.hasValidSignature()) return response.redirect(Env.get('VERIFY_FAILURE_URL'))
    const user = await User.findBy('email', params.email)
    if (!user) return response.redirect(Env.get('VERIFY_FAILURE_URL'))
    user.verified = true
    await user.save()
    return response.redirect(Env.get('VERIFY_SUCCESS_URL'))
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(LoginValidator)
    try {
      const token = await auth.attempt(data.email, data.password)
      const user = await User.findBy('email', data.email)
      return user?.verified
        ? response.ok(token)
        : response.forbidden({ errors: ['Tienes que verificar tu correo electrónico primero'] })
    } catch {
      return response.unauthorized({ errors: ['Bro estas credenciales no están bien.'] })
    }
  }
}
