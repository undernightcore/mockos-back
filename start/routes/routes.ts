import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.put(':id', 'RoutesController.edit')
  Route.get(':id', 'RoutesController.get')
  Route.delete(':id', 'RoutesController.delete')
}).prefix('route')
