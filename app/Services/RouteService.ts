// * Types
import type User from 'App/Models/User/User'
import type RouteValidator from 'App/Validators/Route/RouteValidator'
import type RouteOrCargoContact from 'App/Models/RouteOrCargoContact'
import type RouteSearchValidator from 'App/Validators/Route/RouteSearchValidator'
import type { Err } from 'Contracts/response'
import type { ArchivingConfig } from 'Contracts/app'
import type { JSONPaginate } from 'Contracts/database'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import ms from 'ms'
import Route from 'App/Models/Route'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import RouteOrCargoContactService from './RouteOrCargoContactService'
import { DateTime } from 'luxon'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RouteService {
  public static async paginateByCity(city: string, config: PaginateConfig<Route>): Promise<JSONPaginate> {
    try {
      const routes: JSONPaginate = (await Route
        .query()
        .withScopes((scopes) => scopes.notTemplate())
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
        .withScopes((scopes) => scopes.notTemplate())
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
        .withScopes((scopes) => scopes.notTemplate())
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
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async getUserRoutesIds(userId: User['id']): Promise<Route['id'][]> {
    try {
      const routes: Route[] = await Route
        .query()
        .select(['id']) // car_id and user_id for preload (not needed, because it throw error) relations
        .withScopes((scopes) => scopes.getByUserId(userId))
        .pojo()

      return routes.map((item: Route) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: RouteValidator['schema']['props'], { trx }: ServiceConfig<Route> = {}): Promise<Route> {
    let id: Route['id']
    const contactsPayload: Partial<ModelAttributes<RouteOrCargoContact>>[] | undefined = payload.contacts

    if (!trx)
      trx = await Database.transaction()

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
      const routes: { total: number }[] = await Route
        .query()
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.notInArchive())
        .count('* as total')
        .pojo()

      return routes[0].total
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
    let query = Route
      .query()
      .withScopes((scopes) => scopes.notTemplate())
      .withScopes((scopes) => scopes.notInArchive())
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

  public static async archiveOldRows(expire: NonNullable<ArchivingConfig['routes']>): Promise<void> {
    let lastPage: number = 1
    const page: number = 1
    const limit: number = 30

    try {
      const testQuery: ModelPaginatorContract<Route> = await this.paginateOldRows({ page, limit }, expire)
      lastPage = testQuery.lastPage
    } catch (err: Err | any) {
      throw err
    }

    for (let i = page; i <= lastPage; i++) {
      let routes: ModelPaginatorContract<Route>
      const config: PaginateConfig<Route> = {
        limit,
        page: i,
      }

      try {
        routes = await this.paginateOldRows(config, expire)
      } catch (err: Err | any) {
        throw err
      }

      try {
        await Promise.all(routes.map(async (item: Route) => {
          await item.merge({ isArchive: true }).save()
        }))
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }
  }

  /**
   * * Private methods
   */

  private static async paginateOldRows(config: PaginateConfig<Route>, expire: NonNullable<ArchivingConfig['routes']>): Promise<ModelPaginatorContract<Route>> {
    const expirationDate: DateTime = DateTime.now().minus(ms(expire))

    try {
      return await Route
        .query()
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.notInArchive())
        .withScopes((scopes) => scopes.getForArchiving(expirationDate))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
