// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UserService from 'App/Services/User/UserService'

export default class UsersController {
  public async index({ view, session, request, route, response }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)
    const columns: typeof User.columns[number][] = [
      'id', 'email', 'firstName', 'lastName',
      'roleId', 'subject', 'isBlocked',
    ]

    try {
      const users: User[] = await UserService.paginate({ page, baseUrl }, columns)

      return view.render('pages/users/index', { users })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, session, params, response }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      const item: User = await UserService.get(id)

      return view.render('pages/users/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  /**
   * * Block
   */

  public async block({ params, response, session }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      await UserService.blockAction(id, 'block')
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unblock({ params, response, session }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      await UserService.blockAction(id, 'unblock')
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
