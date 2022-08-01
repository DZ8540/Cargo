// * Types
import type User from 'App/Models/User/User'
import type RouteValidator from 'App/Validators/Route/RouteValidator'
import type RouteOrCargoContact from 'App/Models/RouteOrCargoContact'
import type RouteSearchValidator from 'App/Validators/Route/RouteSearchValidator'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
// * Types

import Route from 'App/Models/Route'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import RouteOrCargoContactService from './RouteOrCargoContactService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RouteService {
  public static async paginateByCity(city: string, config: PaginateConfig<Route>): Promise<JSONPaginate> {
    try {
      const routes: JSONPaginate = (await Route
        .query()
        .withScopes((scopes) => scopes.notInArchive())
        .withScopes((scopes) => scopes.getByCity(city))
        .getViaPaginate(config))
        .toJSON()

      routes.data = await Promise.all(routes.data.map(async (item: Route) => item.getForUser()))

      return routes
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserRoutes(userId: User['id'], config: PaginateConfig<Route>): Promise<JSONPaginate> {
    try {
      const routes: JSONPaginate = (await Route
        .query()
        .withScopes((scopes) => scopes.notInArchive())
        .withScopes((scopes) => scopes.getByUserId(userId))
        .getViaPaginate(config))
        .toJSON()

      routes.data = await Promise.all(routes.data.map(async (item: Route) => item.getForUser()))

      return routes
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateArchiveUserRoutes(userId: User['id'], config: PaginateConfig<Route>): Promise<JSONPaginate> {
    try {
      const routes: JSONPaginate = (await Route
        .query()
        .withScopes((scopes) => scopes.inArchive())
        .withScopes((scopes) => scopes.getByUserId(userId))
        .getViaPaginate(config))
        .toJSON()

      routes.data = await Promise.all(routes.data.map(async (item: Route) => item.getForUser()))

      return routes
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Route['id'], { trx }: ServiceConfig<Route> = {}): Promise<Route> {
    let item: Route | null

    try {
      item = await Route.find(id, { client: trx })
    } catch (err: Err | any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: RouteValidator['schema']['props']): Promise<Route> {
    let id: Route['id']
    const trx: TransactionClientContract = await Database.transaction()
    const contactsPayload: Partial<ModelAttributes<RouteOrCargoContact>>[] | undefined = payload.contacts

    try {
      id = (await Route.create(payload, { client: trx })).id
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      if (contactsPayload) {
        for (const item of contactsPayload) {
          item.routeId = id
        }

        await RouteOrCargoContactService.createMany(contactsPayload, { trx })
      }

      await trx.commit()

      return await this.get(id)
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }
  }

  public static async update(id: Route['id'], payload: RouteValidator['schema']['props']): Promise<Route> {
    let item: Route
    const trx: TransactionClientContract = await Database.transaction()

    try {
      item = await this.get(id, { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    try {
      await item.merge(payload).save()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      await trx.commit()

      return await this.get(id)
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }
  }

  public static async delete(id: Route['id']): Promise<void> {
    let item: Route

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

  public static async getCount(): Promise<number> {
    try {
      const routes = await Route
        .query()
        .withScopes((scopes) => scopes.notInArchive())
        .count('* as total')

      return routes[0].$extras.total
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async unArchive(id: Route['id']): Promise<void> {
    let item: Route

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isArchive: false }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async search(payload: RouteSearchValidator['schema']['props']): Promise<JSONPaginate> {
    let query = Route.query()
    const config: PaginateConfig<Route> = {
      page: payload.page,
      limit: payload.limit,
      orderBy: payload.orderBy,
      orderByColumn: payload.orderByColumn,
    }

    try {
      for (const key in payload) {
        if (payload[key]) {
          switch (key) {
            case 'onlyVerified':
              if (payload[key]) {
                query = query.whereHas('car', (query) => {
                  query.withScopes((scopes) => scopes.onlyVerified())
                })
              }

              break

            case 'width':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.moreThanWidth(payload[key]))
              })

              break

            case 'height':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.moreThanHeight(payload[key]))
              })

              break

            case 'length':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.moreThanLength(payload[key]))
              })

              break

            case 'carBodyTypeId':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.getByCarBodyTypeId(payload[key]))
              })

              break

            case 'carryingTo':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.lessThanCarrying(payload[key]))
              })

              break

            case 'carryingFrom':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.moreThanCarrying(payload[key]))
              })

              break

            case 'capacityTo':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.lessThanCapacity(payload[key]))
              })

              break

            case 'capacityFrom':
              query = query.whereHas('car', (query) => {
                query.withScopes((scopes) => scopes.moreThanCapacity(payload[key]))
              })

              break

            case 'fromRoute':
              query = query.withScopes((scopes) => scopes.getByFromRoute(payload[key]))

              break

            case 'toRoute':
              query = query.withScopes((scopes) => scopes.getByToRoute(payload[key]))

              break

            default:
              break
          }
        }
      }

      const routes: JSONPaginate = (await query.getViaPaginate(config)).toJSON()
      routes.data = await Promise.all(routes.data.map(async (item: Route) => item.getForUser()))

      return routes
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
