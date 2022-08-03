import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')

    Route.get('/logout', 'Api/AuthController.logout').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route.get('/refreshToken', 'Api/AuthController.refreshToken').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route.group(() => {

      Route.post('/', 'Api/AuthController.register').middleware('CheckAuthHeaders')
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

    Route.get('/:id', 'Api/User/UsersController.get').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

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
    Route.get('/:slug', 'Api/NewsController.get')

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

    Route.get('/:id', 'Api/RoutesController.get')
    Route.patch('/:id', 'Api/RoutesController.update').middleware('CheckAccessToken')
    Route.delete('/:id', 'Api/RoutesController.delete').middleware('CheckAccessToken')
    Route.post('/', 'Api/RoutesController.create').middleware('CheckAccessToken')

  }).prefix('route')

  /**
   * * Cargo
   */

  Route.group(() => {

    Route.get('/itemTypes', 'Api/Cargo/CargosItemsTypesController.getAll').middleware('CheckAccessToken')
    Route.get('/packageTypes', 'Api/Cargo/CargosItemsPackageTypesController.getAll').middleware('CheckAccessToken')

    Route.get('/count', 'Api/Cargo/CargosController.count')
    Route.post('/search', 'Api/Cargo/CargosController.search')
    Route.post('/paginate/:city', 'Api/Cargo/CargosController.paginate')
    Route.post('/notArchive/:userId', 'Api/Cargo/CargosController.paginateUserCargos').middleware('CheckAccessToken')
    Route.post('/archive/:userId', 'Api/Cargo/CargosController.paginateArchiveUserCargos').middleware('CheckAccessToken')
    Route.post('/unArchive/:id', 'Api/Cargo/CargosController.unArchive').middleware('CheckAccessToken')

    Route.get('/:id', 'Api/Cargo/CargosController.get')
    Route.patch('/:id', 'Api/Cargo/CargosController.update').middleware('CheckAccessToken')
    Route.delete('/:id', 'Api/Cargo/CargosController.delete').middleware('CheckAccessToken')
    Route.post('/', 'Api/Cargo/CargosController.create').middleware('CheckAccessToken')

  }).prefix('cargo')

  /**
   * * Template
   */

  Route.group(() => {

    Route.group(() => {

      Route.post('/', 'Api/TemplatesController.createRouteTemplate')
      Route.post('/:userId', 'Api/TemplatesController.paginateForRoutes').where('userId', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    }).prefix('route')

    Route.group(() => {

      Route.post('/', 'Api/TemplatesController.createCargoTemplate')
      Route.post('/:userId', 'Api/TemplatesController.paginateForCargos').where('userId', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    }).prefix('cargo')

    Route.patch('/:id', 'Api/TemplatesController.update').where('userId', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    Route.delete('/:id', 'Api/TemplatesController.delete').where('userId', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

  }).prefix('template').middleware('CheckAccessToken')

}).prefix('api')
