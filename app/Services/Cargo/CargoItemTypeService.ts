// * Types
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import CargoItemType from 'App/Models/Cargo/CargoItemType'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargoItemTypeService {
  public static async getAll(): Promise<CargoItemType[]> {
    try {
      return await CargoItemType.all()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
