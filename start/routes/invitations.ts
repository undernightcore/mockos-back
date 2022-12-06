import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'InvitationsController.getList')
}).prefix('invitations')
