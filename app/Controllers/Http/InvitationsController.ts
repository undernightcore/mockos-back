import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'

export default class InvitationsController {
  public async getList({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const page = await request.input('page')
    const perPage = await request.input('perPage')
    const invitations = await user
      .related('invitations')
      .query()
      .where('verified', false)
      .preload('project')
      .paginate(page ?? 1, perPage ?? 10)
    return response.ok(invitations)
  }

  public async accept({ response, auth, params, bouncer }: HttpContextContract) {
    const user = await auth.authenticate()
    const invitation = await Member.findOrFail(params.id)
    await bouncer.with('InvitationPolicy').authorize('isInvited', invitation)
    await invitation.load('project')
    invitation.verified = true
    await invitation.save()
    return response.ok({ message: `Bienvenido a ${invitation.project.name}, ${user.name}!` })
  }
}
