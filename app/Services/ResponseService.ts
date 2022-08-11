// * Types
import type Route from 'App/Models/Route'
import type User from 'App/Models/User/User'
import type Cargo from 'App/Models/Cargo/Cargo'
import type ApiValidator from 'App/Validators/ApiValidator'
import type ResponseValidator from 'App/Validators/ResponseValidator'
import type { Err } from 'Contracts/response'
import type { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import RouteService from './RouteService'
import Response from 'App/Models/Response'
import Logger from '@ioc:Adonis/Core/Logger'
import CargoService from './Cargo/CargoService'
import { ResponseCodes } from 'Config/response'
import { ResponseMessages, ResponsesStatusTypes } from 'Config/response'

type HTTPResponse = Err & {
  status: number,
}

type UserResponsesConfig = {
  type: 'cargo' | 'route',
  statusType: ResponsesStatusTypes,
}

export default class ResponseService {

  /**
   * * For HTTP responses
   */

  constructor(message: ResponseMessages, body?: HTTPResponse['body']) {
    return {
      body,
      message,
      status: 200,
      code: ResponseCodes.SUCCESS,
    } as HTTPResponse
  }

  /**
   * * For routes' and cargo' model
   */

  public static async paginateUserResponses(userId: User['id'], payload: ApiValidator['schema']['props'], config: UserResponsesConfig): Promise<ModelPaginatorContract<Response>> {
    let query = Response.query()

    if (config.type === 'route')
      query = query.withScopes((scopes) => scopes.getRoutes())
    else
      query = query.withScopes((scopes) => scopes.getCargo())

    try {
      return await query
        .withScopes((scopes) => scopes.getByUserId(userId))
        .withScopes((scopes) => scopes.getByStatus(config.statusType))
        .getViaPaginate(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: ResponseValidator['schema']['props']): Promise<Response> {
    const responsePayload: Partial<ModelAttributes<Response>> = {
      userId: payload.userId,
      status: ResponsesStatusTypes.UNDER_CONSIDERATION,
    }

    if (payload.routeId)
      responsePayload.routeId = payload.routeId
    else
      responsePayload.cargoId = payload.cargoId

    try {
      return await Response.create(responsePayload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async complete(id: Response['id']): Promise<Response> {
    try {
      return await this.update(id, ResponsesStatusTypes.COMPLETED)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async accept(id: Response['id']): Promise<Response> {
    try {
      return await this.update(id, ResponsesStatusTypes.IN_PROCESS)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async reject(id: Response['id']): Promise<void> {
    let item: Response

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

  public static async getCompletedCargoResponsesCount(): Promise<number> {
    try {
      const routes: { total: number }[] = await Response
        .query()
        .withScopes((scopes) => scopes.getCargo())
        .withScopes((scopes) => scopes.getByStatus(ResponsesStatusTypes.COMPLETED))
        .count('* as total')
        .pojo()

      return routes[0].total
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Incomings
   */

  public static async paginateIncumingsRoutesResponses(userId: User['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    let routesIds: Route['id'][]

    try {
      routesIds = await RouteService.getUserRoutesIds(userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await Response
        .query()
        .withScopes((scopes) => scopes.getByRoutesIds(routesIds))
        .withScopes((scopes) => scopes.getByStatus(ResponsesStatusTypes.UNDER_CONSIDERATION))
        .getViaPaginate(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateIncumingsCargoResponses(userId: User['id'], payload: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Response>> {
    let cargoIds: Cargo['id'][]

    try {
      cargoIds = await CargoService.getUserCargosIds(userId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await Response
        .query()
        .withScopes((scopes) => scopes.getByCargoIds(cargoIds))
        .withScopes((scopes) => scopes.getByStatus(ResponsesStatusTypes.UNDER_CONSIDERATION))
        .getViaPaginate(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async get(id: Response['id']): Promise<Response> {
    let item: Response | null

    try {
      item = await Response.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  private static async update(id: Response['id'], status: ResponsesStatusTypes): Promise<Response> {
    let item: Response

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      return await item.merge({ status }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
