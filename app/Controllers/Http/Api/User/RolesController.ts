// * Types
import type Role from 'App/Models/User/Role'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import RoleService from 'App/Services/User/RoleService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseMessages } from 'Config/response'

export default class RolesController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const roles: Role[] = await RoleService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, roles))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
