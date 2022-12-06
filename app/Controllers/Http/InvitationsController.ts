import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
}
