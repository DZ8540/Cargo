// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AuthService from 'App/Services/AuthService'
import { SESSION_USER_KEY } from 'Config/session'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CheckAdminPanelAccess {
  public async handle({ session, response }: HttpContextContract, next: () => Promise<void>) {
    const currentUser: User | null = session.get(SESSION_USER_KEY)

    try {
      if (!currentUser)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err

      await AuthService.checkAdminAccess(currentUser.id)
    } catch (err: Err | any) {
      session.forget(SESSION_USER_KEY)

      session.flash('error', err.message)
      response.redirect().toRoute('login')
    }

    await next()
  }
}
