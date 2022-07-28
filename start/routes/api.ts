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

    Route.post('/', 'Api/NewsController.paginate')
    Route.post('/random', 'Api/NewsController.random')
    Route.post('/:slug', 'Api/NewsController.get')

  }).prefix('/news')

  /**
   * * Car
   */

  Route.group(() => {

    Route.get('/bodyTypes', 'Api/Car/CarBodyTypesController.getAll')
    Route.post('/user/:userId', 'Api/Car/CarsController.paginate')

    Route.get('/:id', 'Api/Car/CarsController.get')
    Route.patch('/:id', 'Api/Car/CarsController.update')
    Route.delete('/:id', 'Api/Car/CarsController.delete')
    Route.post('/', 'Api/Car/CarsController.create')

  }).prefix('car').middleware('CheckAccessToken')

  /**
   * * Route
   */

  Route.group(() => {

    Route.get('/count', 'Api/RoutesController.count')
    Route.post('/search', 'Api/RoutesController.search')
    Route.post('/paginate/:city', 'Api/RoutesController.paginate')
    Route.post('/notArchive/:userId', 'Api/RoutesController.paginateUserRoutes').middleware('CheckAccessToken')
    Route.post('/archive/:userId', 'Api/RoutesController.paginateArchiveUserRoutes').middleware('CheckAccessToken')
    Route.post('/unArchive/:id', 'Api/RoutesController.unArchive').middleware('CheckAccessToken')

    Route.post('/:id', 'Api/RoutesController.get')
    Route.patch('/:id', 'Api/RoutesController.update').middleware('CheckAccessToken')
    Route.delete('/:id', 'Api/RoutesController.delete').middleware('CheckAccessToken')
    Route.post('/', 'Api/RoutesController.create').middleware('CheckAccessToken')

  }).prefix('route')

}).prefix('api')
