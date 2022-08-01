// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import UserService from 'App/Services/User/UserService'
import UserValidator from 'App/Validators/UserValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UsersController {
  public async get({ response, params }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      const user: User = await UserService.get(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, user))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: UserValidator['schema']['props']
    const id: User['id'] = params.id

    try {
      payload = await request.validate(UserValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const user: User = await UserService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, user))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async deleteAvatar({ response, params }: HttpContextContract) {
    const id: User['id'] = params.id

    try {
      const user: User = await UserService.deleteAvatar(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, user))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
