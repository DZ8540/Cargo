// * Types
import type Route from 'App/Models/Route'
import type Cargo from 'App/Models/Cargo/Cargo'
import type { Err } from 'Contracts/response'
import type { ServiceConfig } from 'Contracts/services'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import RouteOrCargoContact from 'App/Models/RouteOrCargoContact'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RouteOrCargoContactService {
  public static async createMany(payload: Partial<ModelAttributes<RouteOrCargoContact>>[], { trx }: ServiceConfig<RouteOrCargoContact> = {}): Promise<RouteOrCargoContact[]> {
    for (const key in payload) {
      if (!payload[key].cargoId && !payload[key].routeId) {
        Logger.error(`Payload key: ${key}`)
        Logger.error(ResponseMessages.CARGO_ID_OR_ROUTE_ID_NOT_FOUND)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }

    try {
      await this.deleteByRouteIdOrCargoId(payload[0].routeId, payload[0].cargoId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await RouteOrCargoContact.createMany(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async deleteByRouteIdOrCargoId(routeId: Route['id'] | undefined, cargoId: Cargo['id'] | undefined): Promise<void> {
    let query = RouteOrCargoContact.query()

    if (routeId)
      query = query.withScopes((scopes) => scopes.getByRouteId(routeId))
    else if (cargoId)
      query = query.withScopes((scopes) => scopes.getByCargoId(cargoId))

    try {
      await query.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
