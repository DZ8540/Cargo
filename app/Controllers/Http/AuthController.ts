// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AuthService from 'App/Services/AuthService'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import { SESSION_USER_KEY } from 'Config/session'

export default class AuthController {
  public async login({ view, session, response }: HttpContextContract) {
    if (session.get(SESSION_USER_KEY))
      return response.redirect().toRoute('home')

    return view.render('pages/login')
  }

  public async loginAction({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)

    try {
      const { id } = await AuthService.login(payload)

      session.put(SESSION_USER_KEY, id)

      return response.redirect().toRoute('home')
    } catch (err: Err | any) {
      session.forget(SESSION_USER_KEY)

      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async logout({ session, response }: HttpContextContract) {
    session.forget(SESSION_USER_KEY)
    return response.redirect().toRoute('login')
  }
}
