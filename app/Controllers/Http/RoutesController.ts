import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import CreateRouteValidator from 'App/Validators/CreateRouteValidator'
import Route from 'App/Models/Route'
import EditRouteValidator from 'App/Validators/EditRouteValidator'

export default class RoutesController {
  public async create({ request, response, auth, params, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.id)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const data = await request.validate(CreateRouteValidator)
    const route = await project.related('routes').create(data)
    return response.created(route)
  }

  public async edit({ request, response, auth, params, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const data = await request.validate(EditRouteValidator)
    const route = await Route.findOrFail(params.id)
    const project = await Project.findOrFail(route.projectId)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const newRoute = await route.merge(data).save()
    return response.ok(newRoute)
  }

  public async get({ response, auth, params, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const route = await Route.findOrFail(params.id)
    const project = await Project.findOrFail(route.projectId)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    return response.ok(route)
  }

  public async getList({ response, request, auth, params, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.id)
    const page = await request.input('page')
    const perPage = await request.input('perPage')
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const routes = await project
      .related('routes')
      .query()
      .paginate(page ?? 1, perPage ?? 10)
    return response.ok(routes)
  }
}
