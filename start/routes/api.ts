import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')

    Route.group(() => {

      Route.post('/', 'Api/AuthController.register')
      Route.post('/emailVerify', 'Api/AuthController.emailVerify')
      Route.post('/codeVerify', 'Api/AuthController.codeVerify')

    }).prefix('register')

    Route.group(() => {

      Route.post('/', 'Api/AuthController.forgotPassword')
      Route.post('/emailVerify', 'Api/AuthController.forgotPasswordEmailVerify')
      Route.post('/codeVerify', 'Api/AuthController.forgotPasswordCodeVerify')

    }).prefix('/forgotPassword')

  }).prefix('auth')

  /**
   * * User
   */

  Route.group(() => {

    Route.get('/accountTypes', 'Api/User/RolesController.getAll')

  }).prefix('user')

}).prefix('api')
