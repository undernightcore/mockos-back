import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'

export default class ProjectPolicy extends BasePolicy {
  public async isMember(user: User, project: Project) {
    return Boolean(await project.related('members').query().where('user_id', user.id).first())
  }
}
