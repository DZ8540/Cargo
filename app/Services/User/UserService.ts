// * Types
import type RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import type { Err } from 'Contracts/response'
// * Types

import User from 'App/Models/User/User'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UserService {
  public static async get(id: User['id']): Promise<User> {
    let item: User | null

    try {
      item = await User.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err

    return item
  }

  public static async create(payload: RegisterValidator['schema']['props']): Promise<User> {
    let item: User

    try {
      item = await User.create({ ...payload })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(item.id)
    } catch (err: Err | any) {
      throw err
    }
  }
}
