import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.any('', 'ApiController.mock')
  Route.any('*', 'ApiController.mock')
}).prefix('api')
