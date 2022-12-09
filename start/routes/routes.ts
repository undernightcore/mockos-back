import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.put(':id', 'RoutesController.edit')
  Route.get(':id', 'RoutesController.get')
}).prefix('route')
