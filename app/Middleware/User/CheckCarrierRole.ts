// * Types
import type { Err } from 'Contracts/response'
import type { UserTokenPayload } from 'Contracts/token'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import authConfig from 'Config/auth'
import TokenService from 'App/Services/TokenService'
import ExceptionService from 'App/Services/ExceptionService'
import { getToken } from 'Helpers/index'
import { RolesNames } from 'Config/shield'
import { ResponseCodes, ResponseMessages } from 'Config/response'

/**
 * ! Use this middleware after check access token middleware
 */

export default class CheckCarrierRole {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const needRoles: RolesNames[] = [RolesNames.CARRIER, RolesNames.ADMIN, RolesNames.CARRIER_CARGO_OWNER]
    const headerToken: string = request.header('Authorization')!
    const token: string = getToken(headerToken)

    try {
      const payload: UserTokenPayload = TokenService.verifyToken(token, authConfig.access.key)

      if (!needRoles.includes(payload.roleId - 1)) // -1 for get actual index
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ACCESS } as Err

      await next()
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
