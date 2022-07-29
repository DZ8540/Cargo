// * Types
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import CargoItemPackageType from 'App/Models/Cargo/CargoItemPackageType'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargoItemPackageTypeService {
  public static async getAll(): Promise<CargoItemPackageType[]> {
    try {
      return await CargoItemPackageType.all()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
