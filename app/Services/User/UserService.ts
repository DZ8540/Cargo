// * Types
import type UserValidator from 'App/Validators/UserValidator'
import type RegisterValidator from 'App/Validators/Auth/Register/RegisterValidator'
import type { Err } from 'Contracts/response'
// * Types

import User from 'App/Models/User/User'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import { USER_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class UserService {
  public static async get(id: User['id']): Promise<User>
  public static async get(email: User['email']): Promise<User>
  public static async get(idOrEmail: User['id'] | User['email']): Promise<User> {
    let item: User | null

    try {
      if (typeof idOrEmail === 'number')
        item = await User.find(idOrEmail)
      else
        item = await User.findBy('email', idOrEmail)
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

  public static async update(id: User['id'], payload: UserValidator['schema']['props']): Promise<User> {
    let item: User
    let avatar: User['avatar'] = undefined

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    if (payload.avatar) {
      try {
        if (item.avatar)
          await Drive.delete(item.avatar)

        await payload.avatar.moveToDisk(USER_PATH)
        avatar = `${USER_PATH}/${payload.avatar.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    try {
      await item.merge({ ...payload, avatar }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async deleteAvatar(id: User['id']): Promise<User> {
    let item: User

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      if (item.avatar)
        await Drive.delete(item.avatar)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      await item.merge({ avatar: null }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }
}
