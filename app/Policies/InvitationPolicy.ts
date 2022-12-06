import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Member from 'App/Models/Member'

export default class InvitationPolicy extends BasePolicy {
  public async isInvited(user: User, invitation: Member) {
    const isUserInvited = invitation.userId === user.id
    return !isUserInvited ? Bouncer.deny('No te han invitado a esta fiesta!', 403) : true
  }
}
