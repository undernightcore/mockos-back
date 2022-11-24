import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const user = await User.create(data)
    const verificationUrl = Route.makeSignedUrl('verifyEmail', {
      email: user.email,
    })
    await Mail.send((message) => {
      message
        .from('mockos@puntaserver.com')
        .to(user.email)
        .subject('¡Bienvenido a Mockos!')
        .text(`Porfi, verifica tu correo aquí http://localhost:3333${verificationUrl}`)
    })
    return response.created({ message: `Holi ${user.name}, verifica tu correo electrónico porfa` })
  }

  public async verify({ request, response, params }: HttpContextContract) {
    if (!request.hasValidSignature()) return response.redirect('https://bing.es')
    const user = await User.findBy('email', params.email)
    if (!user) return response.redirect('https://bing.es')
    user.verified = true
    await user.save()
    return response.redirect('https://google.es')
  }
}
