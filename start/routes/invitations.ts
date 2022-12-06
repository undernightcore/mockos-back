import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'InvitationsController.getList')
  Route.post(':id', 'InvitationsController.accept')
}).prefix('invitations')
