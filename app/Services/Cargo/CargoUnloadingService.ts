// * Types
import type Cargo from 'App/Models/Cargo/Cargo'
import type CargoValidator from 'App/Validators/Cargo/CargoValidator'
import type { Err } from 'Contracts/response'
import type { ServiceConfig } from 'Contracts/services'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import CargoUnloading from 'App/Models/Cargo/CargoUnloading'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargoUnloadingService {
  public static async createMany(cargoId: Cargo['id'], payload: CargoValidator['schema']['props']['unloadings'], { trx }: ServiceConfig<CargoUnloading> = {}): Promise<void> {
    const payloadWithCargoId: Partial<ModelAttributes<CargoUnloading>>[] = payload.map((item) => {
      const timeFrom: string | undefined = item.timeFrom?.toFormat('HH:mm')
      const timeTo: string | undefined = item.timeTo?.toFormat('HH:mm')

      return { ...item, timeFrom, timeTo, cargoId }
    })

    try {
      await this.deleteByCargoId(cargoId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await CargoUnloading.createMany(payloadWithCargoId, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async deleteByCargoId(cargoId: Cargo['id']): Promise<void> {
    try {
      await CargoUnloading
        .query()
        .withScopes((scopes) => scopes.getByCargoId(cargoId))
        .delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
