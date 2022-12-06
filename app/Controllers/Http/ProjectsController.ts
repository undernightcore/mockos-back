import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import Project from 'App/Models/Project'
import EditPostValidator from 'App/Validators/EditPostValidator'
import User from 'App/Models/User'

export default class ProjectsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const data = await request.validate(CreatePostValidator)
    const project = await Project.create(data)
    await project.related('members').attach({ [user.id]: { verified: true } })
    return response.created(project)
  }

  public async delete({ response, params, bouncer, auth }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.id)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    await project.delete()
    return response.ok(project)
  }

  public async edit({ request, params, response, auth, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const data = await request.validate(EditPostValidator)
    const project = await Project.findOrFail(params.id)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    const newProject = await project?.merge(data).save()
    return response.ok(newProject)
  }

  public async get({ params, response, auth, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.id)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    return response.ok(project)
  }

  public async getList({ response, request, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const page = await request.input('page')
    const perPage = await request.input('perPage')
    const projectList = await user
      .related('projects')
      .query()
      .paginate(page ?? 1, perPage ?? 10)
    return response.ok(projectList)
  }

  public async invite({ response, params, auth, bouncer }: HttpContextContract) {
    await auth.authenticate()
    const project = await Project.findOrFail(params.projectId)
    const user = await User.findOrFail(params.userId)
    await bouncer.with('ProjectPolicy').authorize('isMember', project)
    await bouncer.forUser(user).with('ProjectPolicy').authorize('isAlreadyMember', project)
    await bouncer.forUser(user).with('GlobalPolicy').authorize('isVerified')
    await project.related('members').attach({
      [user.id]: {
        verified: false,
      },
    })
    return response.ok({ message: 'User has been invited' })
  }
}
