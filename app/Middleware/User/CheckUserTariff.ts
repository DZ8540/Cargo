// * Types
import type { Err } from 'Contracts/response'
import type { UserTokenPayload } from 'Contracts/token'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import authConfig from 'Config/auth'
import TokenService from 'App/Services/TokenService'
import UserService from 'App/Services/User/UserService'
import ExceptionService from 'App/Services/ExceptionService'
import { getToken } from 'Helpers/index'

export default class CheckUserTariff {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const headerToken: string = request.header('Authorization')!
    const token: string = getToken(headerToken)

    try {
      const { id }: UserTokenPayload = TokenService.verifyToken(token, authConfig.access.key)
      await UserService.checkTariff(id)

      await next()
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
