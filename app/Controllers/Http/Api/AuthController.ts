// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import AuthService from 'App/Services/AuthService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import CodeVerifyValidator from 'App/Validators/Auth/CodeVerifyValidator'
import EmailVerifyValidator from 'App/Validators/Auth/EmailVerifyValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class AuthController {
  /**
   * * Register
   */

  public async register({ request, response }: HttpContextContract) {
    let payload: RegisterValidator['schema']['props']

    try {
      payload = await request.validate(RegisterValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const user: User = await AuthService.registerViaAPI(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, user))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async emailVerify({ request, response }: HttpContextContract) {
    let payload: EmailVerifyValidator['schema']['props']

    try {
      payload = await request.validate(EmailVerifyValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await AuthService.emailVerify(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async codeVerify({ request, response }: HttpContextContract) {
    let payload: CodeVerifyValidator['schema']['props']

    try {
      payload = await request.validate(CodeVerifyValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      await AuthService.codeVerify(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
