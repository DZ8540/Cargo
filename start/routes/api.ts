import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')

    Route
      .post('/refreshToken/:userId', 'Api/AuthController.refreshToken')
      .middleware(['CheckAuthHeaders', 'CheckRefreshToken'])
      .where('userId', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

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

    Route
      .patch('/:id', 'Api/User/UsersController.update')
      .middleware('CheckAccessToken')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    Route
      .delete('/deleteAvatar/:id', 'Api/User/UsersController.deleteAvatar')
      .middleware('CheckAccessToken')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

  }).prefix('user')

  /**
   * * News
   */

  Route.group(() => {

    Route.post('/', 'Api/NewsController.all')
    Route.post('/random', 'Api/NewsController.random')
    Route.post('/:slug', 'Api/NewsController.get')

  }).prefix('/news')

}).prefix('api')
