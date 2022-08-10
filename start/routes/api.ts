import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post('/question', 'Api/QuestionsController.create')

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

  }).prefix('news')

  /**
   * * Report
   */

  Route.group(() => {

    Route.post('/route', 'Api/ReportsController.createRouteReport')
    Route.post('/cargo', 'Api/ReportsController.createCargoReport')
    Route.post('/user', 'Api/ReportsController.createUserReport')
    Route.post('/topic', 'Api/ReportsController.createTopicReport')
    Route.post('/topicMessage', 'Api/ReportsController.createTopicMessageReport')

  }).prefix('report').middleware('CheckAccessToken')

  /**
   * * Car
   */

  Route.group(() => {

    Route.get('/bodyTypes', 'Api/Car/BodyTypesController.getAll')
    Route.post('/user/:userId', 'Api/Car/CarsController.paginate')

    Route.get('/:id', 'Api/Car/CarsController.get')
    Route.patch('/:id', 'Api/Car/CarsController.update')
    Route.delete('/:id', 'Api/Car/CarsController.delete')
    Route.post('/', 'Api/Car/CarsController.create')

  }).prefix('car').middleware(['CheckAccessToken', 'CheckCarrierRole'])

  /**
   * * Route
   */

  Route.group(() => {

    Route.get('/count', 'Api/RoutesController.count')
    Route.post('/search', 'Api/RoutesController.search')
    Route.post('/paginate/:city', 'Api/RoutesController.paginate')
    Route.post('/notArchive/:userId', 'Api/RoutesController.paginateUserRoutes').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/archive/:userId', 'Api/RoutesController.paginateArchiveUserRoutes').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/unArchive/:id', 'Api/RoutesController.unArchive').middleware(['CheckAccessToken', 'CheckCarrierRole'])

    Route.get('/:id', 'Api/RoutesController.get')
    Route.patch('/:id', 'Api/RoutesController.update').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.delete('/:id', 'Api/RoutesController.delete').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/', 'Api/RoutesController.create').middleware(['CheckAccessToken', 'CheckCarrierRole'])

  }).prefix('route')

  /**
   * * Cargo
   */

  Route.group(() => {

    Route.get('/itemTypes', 'Api/Cargo/ItemsTypesController.getAll').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.get('/packageTypes', 'Api/Cargo/PackageTypesController.getAll').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.get('/loadingTypes', 'Api/Cargo/CargosController.getAllLoadingTypes').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])

    Route.get('/count', 'Api/Cargo/CargosController.count')
    Route.post('/search', 'Api/Cargo/CargosController.search')
    Route.post('/paginate/:city', 'Api/Cargo/CargosController.paginate')
    Route.post('/notArchive/:userId', 'Api/Cargo/CargosController.paginateUserCargos').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/archive/:userId', 'Api/Cargo/CargosController.paginateArchiveUserCargos').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/unArchive/:id', 'Api/Cargo/CargosController.unArchive').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])

    Route.get('/:id', 'Api/Cargo/CargosController.get')
    Route.patch('/:id', 'Api/Cargo/CargosController.update').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.delete('/:id', 'Api/Cargo/CargosController.delete').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/', 'Api/Cargo/CargosController.create').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])

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

    }).prefix('route').middleware('CheckCarrierRole')

    Route.group(() => {

      Route.post('/', 'Api/TemplatesController.createCargoTemplate')
      Route.post('/:userId', 'Api/TemplatesController.paginateForCargos').where('userId', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    }).prefix('cargo').middleware('CheckCargoOwnerRole')

    Route.patch('/:id', 'Api/TemplatesController.update').where('userId', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    Route.delete('/:id', 'Api/TemplatesController.delete').where('userId', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

  }).prefix('template').middleware('CheckAccessToken')

  /**
   * * Response
   */

  Route.group(() => {

    Route.group(() => {

      Route.post('/route/:userId', 'Api/ResponsesController.paginateIncumingsRoutesResponses').middleware('CheckCarrierRole')

      Route.post('/cargo/:userId', 'Api/ResponsesController.paginateIncumingsCargoResponses').middleware('CheckCargoOwnerRole')

    }).prefix('incumings')

    Route.group(() => {

      Route.post('/route/:userId', 'Api/ResponsesController.paginateOutgoingsRoutesResponses').middleware('CheckCarrierRole')

      Route.post('/cargo/:userId', 'Api/ResponsesController.paginateOutgoingsCargoResponses').middleware('CheckCargoOwnerRole')

    }).prefix('outgoings')

    Route.group(() => {

      Route.post('/route/:userId', 'Api/ResponsesController.paginateInProcessRoutesResponses').middleware('CheckCarrierRole')

      Route.post('/cargo/:userId', 'Api/ResponsesController.paginateInProcessCargoResponses').middleware('CheckCargoOwnerRole')

    }).prefix('inProcess')

    Route.group(() => {

      Route.post('/route/:userId', 'Api/ResponsesController.paginateCompletedRoutesResponses').middleware('CheckCarrierRole')

      Route.post('/cargo/:userId', 'Api/ResponsesController.paginateCompletedCargoResponses').middleware('CheckCargoOwnerRole')

    }).prefix('completed')

    Route.patch('/:id', 'Api/ResponsesController.accept')
    Route.delete('/:id', 'Api/ResponsesController.reject')

  }).prefix('response').middleware('CheckAccessToken')

  /**
   * * Topic
   */

  Route.group(() => {

    Route.post('/paginate', 'Api/Topic/TopicsController.paginate')

    Route.post('/search', 'Api/Topic/TopicsController.search')

    Route.get('/statistics', 'Api/Topic/TopicsController.getStatistics')

    Route.post('/user/:userId', 'Api/Topic/TopicsController.paginateUserTopics').middleware('CheckAccessToken')

    Route.post('/like', 'Api/Topic/TopicsController.createLike').middleware('CheckAccessToken')

    Route.group(() => {

      Route.post('/like', 'Api/Topic/MessagesController.createLike').middleware('CheckAccessToken')

      Route.post('/:topicId/:userId?', 'Api/Topic/MessagesController.paginate')

      Route.post('/', 'Api/Topic/MessagesController.create').middleware('CheckAccessToken')

    }).prefix('message')

    Route.get('/:id/:userId?', 'Api/Topic/TopicsController.get')
    Route.post('/', 'Api/Topic/TopicsController.create').middleware('CheckAccessToken')

  }).prefix('topic')

}).prefix('api')
