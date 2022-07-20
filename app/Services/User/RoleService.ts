// * Types
import type { Err } from 'Contracts/response'
// * Types

import Role from 'App/Models/User/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RoleService {
  public static async getAll(): Promise<Role[]> {
    try {
      return await Role.all()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
