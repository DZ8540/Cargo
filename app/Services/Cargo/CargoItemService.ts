// * Types
import type Cargo from 'App/Models/Cargo/Cargo'
import type CargoValidator from 'App/Validators/Cargo/CargoValidator'
import type { Err } from 'Contracts/response'
import type { ServiceConfig } from 'Contracts/services'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import CargoItem from 'App/Models/Cargo/CargoItem'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargoItemService {
  public static async createMany(cargoId: Cargo['id'], payload: CargoValidator['schema']['props']['items'], { trx }: ServiceConfig<CargoItem> = {}): Promise<void> {
    const payloadWithCargoId: Partial<ModelAttributes<CargoItem>>[] = payload.map((item) => ({ ...item, cargoId }))

    try {
      await this.deleteByCargoId(cargoId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await CargoItem.createMany(payloadWithCargoId, { client: trx })
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
      await CargoItem
        .query()
        .withScopes((scopes) => scopes.getByCargoId(cargoId))
        .delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
