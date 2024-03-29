import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/cities', 'Api/IndexController.getAllCities')

  Route.get('/tariffs', 'Api/IndexController.getAllTariffs')

  Route.post('/question', 'Api/IndexController.createQuestion')

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

    Route.get('/:id/:currentUserId?', 'Api/User/UsersController.get').where('id', {
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
    Route.post('/user/:userId', 'Api/Car/CarsController.paginate').middleware('CheckCarrierRole')

    Route.get('/:id', 'Api/Car/CarsController.get').middleware('CheckCarrierRole')
    Route.patch('/:id', 'Api/Car/CarsController.update').middleware('CheckCarrierRole')
    Route.delete('/:id', 'Api/Car/CarsController.delete').middleware('CheckCarrierRole')
    Route.post('/', 'Api/Car/CarsController.create').middleware('CheckCarrierRole')

  }).prefix('car').middleware('CheckAccessToken')

  /**
   * * Route
   */

  Route.group(() => {

    Route.get('/count', 'Api/RoutesController.count')
    Route.post('/search', 'Api/RoutesController.search')
    Route.post('/paginate/:city', 'Api/RoutesController.paginate')
    Route.post('/notArchive/:userId', 'Api/RoutesController.paginateUserRoutes').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/archive/:userId', 'Api/RoutesController.paginateArchiveUserRoutes').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/unArchive/:id', 'Api/RoutesController.unArchive').middleware(['CheckAccessToken', 'CheckCarrierRole', 'CheckUserTariff'])

    Route.get('/:id/:currentUserId?', 'Api/RoutesController.get').where('currentUserId', {
      match: /^[0-9]+$/,
      cast: (currentUserId) => Number(currentUserId),
    })
    Route.patch('/:id', 'Api/RoutesController.update').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.delete('/:id', 'Api/RoutesController.delete').middleware(['CheckAccessToken', 'CheckCarrierRole'])
    Route.post('/', 'Api/RoutesController.create').middleware(['CheckAccessToken', 'CheckCarrierRole', 'CheckUserTariff'])

  }).prefix('route')

  /**
   * * Cargo
   */

  Route.group(() => {

    Route.get('/itemTypes', 'Api/Cargo/ItemsTypesController.getAll').middleware('CheckAccessToken')
    Route.get('/packageTypes', 'Api/Cargo/PackageTypesController.getAll').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.get('/loadingTypes', 'Api/Cargo/CargosController.getAllLoadingTypes').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])

    Route.get('/count', 'Api/Cargo/CargosController.count')
    Route.post('/search', 'Api/Cargo/CargosController.search')
    Route.post('/paginate/:city', 'Api/Cargo/CargosController.paginate')
    Route.post('/notArchive/:userId', 'Api/Cargo/CargosController.paginateUserCargos').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/archive/:userId', 'Api/Cargo/CargosController.paginateArchiveUserCargos').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/unArchive/:id', 'Api/Cargo/CargosController.unArchive').middleware(['CheckAccessToken', 'CheckCargoOwnerRole', 'CheckUserTariff'])

    Route.get('/:id/:currentUserId?', 'Api/Cargo/CargosController.get').where('currentUserId', {
      match: /^[0-9]+$/,
      cast: (currentUserId) => Number(currentUserId),
    })
    Route.patch('/:id', 'Api/Cargo/CargosController.update').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.delete('/:id', 'Api/Cargo/CargosController.delete').middleware(['CheckAccessToken', 'CheckCargoOwnerRole'])
    Route.post('/', 'Api/Cargo/CargosController.create').middleware(['CheckAccessToken', 'CheckCargoOwnerRole', 'CheckUserTariff'])

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

      Route.group(() => {

        Route.post('/owner/:userId', 'Api/ResponsesController.paginateInProcessOwnerRoutesResponses')
        Route.post('/executor/:userId', 'Api/ResponsesController.paginateInProcessExecutorRoutesResponses')

      }).prefix('route').middleware('CheckCarrierRole')

      Route.group(() => {

        Route.post('/owner/:userId', 'Api/ResponsesController.paginateInProcessOwnerCargoResponses')
        Route.post('/executor/:userId', 'Api/ResponsesController.paginateInProcessExecutorCargoResponses')

      }).prefix('cargo').middleware('CheckCargoOwnerRole')

    }).prefix('inProcess')

    Route.group(() => {

      Route.post('/route/:userId', 'Api/ResponsesController.paginateCompletedRoutesResponses').middleware('CheckCarrierRole')

      Route.post('/cargo/:userId', 'Api/ResponsesController.paginateCompletedCargoResponses').middleware('CheckCargoOwnerRole')

    }).prefix('completed')

    Route.post('/', 'Api/ResponsesController.create')
    Route.patch('/accept/:id', 'Api/ResponsesController.accept')
    Route.patch('/complete/:id', 'Api/ResponsesController.complete')
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

    Route.group(() => {

      Route.post('/', 'Api/Topic/TopicsController.createLike').middleware('CheckAccessToken')
      Route.delete('/', 'Api/Topic/TopicsController.deleteLike').middleware('CheckAccessToken')

    }).prefix('like')

    Route.group(() => {

      Route.post('/paginateLastMessages', 'Api/Topic/MessagesController.paginateLastMessages')

      Route.post('/create', 'Api/Topic/MessagesController.create').middleware('CheckAccessToken')

      Route.group(() => {

        Route.post('/', 'Api/Topic/MessagesController.createLike').middleware('CheckAccessToken')
        Route.delete('/', 'Api/Topic/MessagesController.deleteLike').middleware('CheckAccessToken')

      }).prefix('like')

      Route.post('/:topicId/:userId?', 'Api/Topic/MessagesController.paginate')

    }).prefix('message')

    Route.get('/:id/:userId?', 'Api/Topic/TopicsController.get')
    Route.post('/', 'Api/Topic/TopicsController.create').middleware('CheckAccessToken')

  }).prefix('topic')

  /**
   * * Payment
   */

  Route.group(() => {

    Route.post('/buyTariff', 'Api/PaymentsController.buyTariffWebHook')
    Route.post('/buyTariff/:userId', 'Api/PaymentsController.buyTariff').where('userId', {
      match: /^[0-9]+$/,
      cast: (userId) => Number(userId),
    })

  }).prefix('payments')

}).prefix('api')
