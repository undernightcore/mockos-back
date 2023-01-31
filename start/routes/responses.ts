import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get(':id', 'ResponsesController.get')
  Route.put(':id', 'ResponsesController.edit')
  Route.delete(':id', 'ResponsesController.delete')
}).prefix('responses')
