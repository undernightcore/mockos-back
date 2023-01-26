import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import Route from 'App/Models/Route'
import CreateRouteValidator from 'App/Validators/Route/CreateRouteValidator'
import EditRouteValidator from 'App/Validators/Route/EditRouteValidator'
import SortRouteValidator from 'App/Validators/Route/SortRouteValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { move } from 'App/Helpers/array.helper'

export default class RoutesController {
  public async create({ request, response, auth, params, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.id)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const data = await request.validate(CreateRouteValidator)
    const lastOrder = await project.related('routes').query().orderBy('order', 'desc').first()
    const route = await project
      .related('routes')
      .create({ ...data, order: (lastOrder?.order ?? 0) + 1 })
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
    const search = await request.input('search')
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const routes = await project
      .related('routes')
      .query()
      .whereILike('name', `%${search ?? ''}%`)
      .orWhereILike('endpoint', `%${search ?? ''}%`)
      .paginate(page ?? 1, perPage ?? 10)
    return response.ok(routes)
  }

  public async sort({ auth, params, request, response }: HttpContextContract) {
    await auth.authenticate()
    const data = await request.validate(SortRouteValidator)
    const project = await Project.findOrFail(params.id)
    const fromRoute = await Route.findOrFail(data.origin)
    const toRoute = await Route.findOrFail(data.destination)
    const sameProject = fromRoute.projectId === project.id && toRoute.projectId === project.id
    if (!sameProject)
      return response
        .status(400)
        .json({ errors: ['Las rutas no corresponden al projecto correcto'] })
    const routes = await project.related('routes').query()
    const fromIndex = routes.findIndex((route) => route.id === fromRoute.id)
    const toIndex = routes.findIndex((route) => route.id === toRoute.id)
    move(routes, fromIndex, toIndex)
    await Database.transaction(async (trx) => {
      await Promise.all(
        routes.map(async (route, index) => {
          route.useTransaction(trx)
          route.order = index + routes.length + 1
          await route.save()
          route.order = index + 1
          await route.save()
        })
      )
      await trx.commit()
    })
    return response.ok({ message: 'Se ha movido correctamente' })
  }
}
