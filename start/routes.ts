/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import './routes/api'

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/', 'IndexController.home').as('home')

  /**
   * * User
   */

  Route.group(() => {

    Route.get('/', 'UsersController.index').as('index')
    Route
      .get('/:id', 'UsersController.show')
      .as('show')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    Route
      .post('/block/:id', 'UsersController.block')
      .as('block')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    Route
      .post('/unblock/:id', 'UsersController.unblock')
      .as('unblock')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

  }).prefix('/users').as('users')

})
