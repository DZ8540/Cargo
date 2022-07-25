// * Types
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import CarBodyType from 'App/Models/CarBodyType'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CarBodyTypeService {
  public static async getAll(): Promise<CarBodyType[]> {
    try {
      return await CarBodyType.all()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
