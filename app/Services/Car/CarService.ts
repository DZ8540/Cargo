// * Types
import type User from 'App/Models/User/User'
import type ApiValidator from 'App/Validators/ApiValidator'
import type CarValidator from 'App/Validators/CarValidator'
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Car from 'App/Models/Car/Car'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CarService {
  public static async paginate(config: PaginateConfig<Car>, columns: typeof Car.columns[number][] = []): Promise<ModelPaginatorContract<Car>> {
    try {
      return await Car.query().select(columns).getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserCars(userId: User['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Car>> {
    try {
      return Car
        .query()
        .withScopes((scopes) => scopes.getByUser(userId))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Car['id']): Promise<Car> {
    let item: Car | null

    try {
      item = await Car.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: CarValidator['schema']['props']): Promise<Car> {
    let id: Car['id']

    try {
      id = (await Car.create(payload)).id
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async update(id: Car['id'], payload: CarValidator['schema']['props']): Promise<Car> {
    let item: Car

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(payload).save()
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

  public static async delete(id: Car['id']): Promise<void> {
    let item: Car

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async verifyAction(id: User['id'], action: 'verify' | 'unVerify'): Promise<void> {
    let item: Car
    const isVerified: Car['isVerified'] = action == 'verify' ? true : false

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isVerified }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
