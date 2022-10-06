// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
// * Types

import Order from 'App/Models/Order'
import UserService from './User/UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import { StatusTypes } from 'Config/order'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class OrderService {
  public static async create(user: User, price: Order['price'], tariffType: Order['tariffType']): Promise<Order>
  public static async create(userId: User['id'], price: Order['price'], tariffType: Order['tariffType']): Promise<Order>
  public static async create(userOrUserId: User | User['id'] , price: Order['price'], tariffType: Order['tariffType']): Promise<Order> {
    let item: User

    if (typeof userOrUserId !== 'object') {
      try {
        item = await UserService.get(userOrUserId)
      } catch (err: Err | any) {
        throw err
      }
    } else {
      item = userOrUserId
    }

    try {
      return await Order.create({ price, tariffType, userId: item.id })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async update(id: Order['id'], statusType: StatusTypes): Promise<Order> {
    let item: Order

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ statusType }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      if (statusType === StatusTypes.CONFIRMED)
        await UserService.updateTariff(item.userId, item.tariffType)

      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  /**
   * * Private methods
   */

  private static async get(id: Order['id']): Promise<Order> {
    let item: Order | null

    try {
      item = await Order.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }
}
