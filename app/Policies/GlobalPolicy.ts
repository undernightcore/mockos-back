import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class GlobalPolicy extends BasePolicy {
  public async isVerified(user: User) {
    return !user.verified
      ? Bouncer.deny('El usuario debe verificar primero su correo electrónico')
      : true
  }
}
