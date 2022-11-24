import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('register', 'AuthController.register')
  Route.get('verify/:email', 'AuthController.verify').as('verifyEmail')
}).prefix('auth')
