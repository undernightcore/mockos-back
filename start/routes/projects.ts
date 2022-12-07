import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'ProjectsController.getList')
  Route.post('', 'ProjectsController.create')
  Route.delete(':id', 'ProjectsController.delete')
  Route.put(':id', 'ProjectsController.edit')
  Route.get(':id', 'ProjectsController.get')
  Route.post(':projectId/member/:userId', 'ProjectsController.invite')
}).prefix('project')
