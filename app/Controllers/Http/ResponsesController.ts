import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from 'App/Models/Route'
import Project from 'App/Models/Project'
import CreateResponseValidator from 'App/Validators/Response/CreateResponseValidator'

export default class ResponsesController {
  public async create({ request, response, auth, bouncer, params }: HttpContextContract) {
    await auth.authenticate()
    const data = await request.validate(CreateResponseValidator)
    const route = await Route.findOrFail(params.id)
    const project = await Project.findOrFail(route.projectId)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const newResponse = await route.related('responses').create(data)
    return response.created(newResponse)
  }
}
