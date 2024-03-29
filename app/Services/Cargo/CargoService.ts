// * Types
import type User from 'App/Models/User/User'
import type CargoValidator from 'App/Validators/Cargo/CargoValidator'
import type RouteOrCargoContact from 'App/Models/RouteOrCargoContact'
import type CargoSearchValidator from 'App/Validators/Cargo/CargoSearchValidator'
import type { Err } from 'Contracts/response'
import type { ArchivingConfig } from 'Contracts/app'
import type { JSONPaginate } from 'Contracts/database'
import type { PaginateConfig, ServiceConfig } from 'Contracts/services'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import type { ModelAttributes, ModelPaginatorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import ms from 'ms'
import Cargo from 'App/Models/Cargo/Cargo'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import CargoItemService from './CargoItemService'
import CargoLoadingService from './CargoLoadingService'
import CargoUnloadingService from './CargoUnloadingService'
import RouteOrCargoContactService from '../RouteOrCargoContactService'
import { DateTime } from 'luxon'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargoService {
  public static async paginate(config: PaginateConfig<Cargo>): Promise<ModelPaginatorContract<Cargo>> {
    let query: ModelQueryBuilderContract<typeof Cargo> = Cargo
      .query()
      .withScopes((scopes) => scopes.notTemplate())

    if (config.relations) {
      for (const item of config.relations) {
        query = query.preload(item)
      }
    }

    try {
      return await query.getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateByCity(city: string, config: PaginateConfig<Cargo>): Promise<JSONPaginate> {
    try {
      const cargos: JSONPaginate = (await Cargo
        .query()
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.getByIsArchive(false))
        .withScopes((scopes) => scopes.getByCity(city))
        .getViaPaginate(config))
        .toJSON()

      cargos.data = await Promise.all(cargos.data.map(async (item: Cargo) => item.getForUser()))

      return cargos
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserCargos(userId: User['id'], config: PaginateConfig<Cargo>): Promise<JSONPaginate> {
    try {
      const cargos: JSONPaginate = (await Cargo
        .query()
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.getByIsArchive(false))
        .withScopes((scopes) => scopes.getByUserId(userId))
        .getViaPaginate(config))
        .toJSON()

      cargos.data = await Promise.all(cargos.data.map(async (item: Cargo) => item.getForUser()))

      return cargos
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateArchiveUserCargos(userId: User['id'], config: PaginateConfig<Cargo>): Promise<JSONPaginate> {
    try {
      const cargos: JSONPaginate = (await Cargo
        .query()
        .withScopes((scopes) => scopes.getByIsArchive(true))
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.getByUserId(userId))
        .getViaPaginate(config))
        .toJSON()

      cargos.data = await Promise.all(cargos.data.map(async (item: Cargo) => item.getForUser()))

      return cargos
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Cargo['id'], { trx }: ServiceConfig<Cargo> = {}): Promise<Cargo> {
    let item: Cargo | null

    try {
      item = await Cargo.find(id, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    try {
      return await item.getForUser()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getUserCargosIds(userId: User['id']): Promise<Cargo['id'][]> {
    try {
      const cargos: Cargo[] = await Cargo
        .query()
        .select('id')
        .withScopes((scopes) => scopes.getByUserId(userId))
        .pojo()

      return cargos.map((item: Cargo) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: CargoValidator['schema']['props'], { trx }: ServiceConfig<Cargo> = {}): Promise<Cargo> {
    let id: Cargo['id']
    const contactsPayload: Partial<ModelAttributes<RouteOrCargoContact>>[] | undefined = payload.contacts
    const cargoPayload: Partial<ModelAttributes<Cargo>> = {
      bargainType: payload.bargainType,
      calculateType: payload.calculateType,

      fromTemperature: payload.fromTemperature,
      toTemperature: payload.toTemperature,

      vatPrice: payload.vatPrice,
      noVatPrice: payload.noVatPrice,
      prepayment: payload.prepayment,

      note: payload.note,

      userId: payload.userId,
      templateId: payload.templateId,
      carBodyTypeId: payload.carBodyTypeId,
    }

    if (!trx)
      trx = await Database.transaction()

    try {
      id = (await Cargo.create(cargoPayload, { client: trx })).id
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      if (contactsPayload) {
        for (const item of contactsPayload) {
          item.cargoId = id
        }

        await RouteOrCargoContactService.createMany(contactsPayload, { trx })
      }

      await CargoItemService.createMany(id, payload.items, { trx })
      await CargoLoadingService.createMany(id, payload.loadings, { trx })
      await CargoUnloadingService.createMany(id, payload.unloadings, { trx })

      await trx.commit()

      return await (await this.get(id)).getForUser()
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }
  }

  public static async update(id: Cargo['id'], payload: CargoValidator['schema']['props']): Promise<Cargo> {
    let item: Cargo
    const trx: TransactionClientContract = await Database.transaction()
    const contactsPayload: Partial<ModelAttributes<RouteOrCargoContact>>[] | undefined = payload.contacts
    const cargoPayload: Partial<ModelAttributes<Cargo>> = {
      bargainType: payload.bargainType,
      calculateType: payload.calculateType,

      fromTemperature: payload.fromTemperature,
      toTemperature: payload.toTemperature,

      vatPrice: payload.vatPrice,
      noVatPrice: payload.noVatPrice,
      prepayment: payload.prepayment,

      note: payload.note,

      userId: payload.userId,
      templateId: payload.templateId,
      carBodyTypeId: payload.carBodyTypeId,
    }

    try {
      item = await this.get(id, { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    try {
      await item.merge(cargoPayload).save()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      if (contactsPayload) {
        for (const item of contactsPayload) {
          item.cargoId = id
        }

        await RouteOrCargoContactService.createMany(contactsPayload, { trx })
      }

      await CargoItemService.createMany(id, payload.items, { trx })
      await CargoLoadingService.createMany(id, payload.loadings, { trx })
      await CargoUnloadingService.createMany(id, payload.unloadings, { trx })

      await trx.commit()

      return await (await this.get(id)).getForUser()
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }
  }

  public static async delete(id: Cargo['id']): Promise<void> {
    let item: Cargo

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

  public static async archiveAction(id: Cargo['id'], isArchive: boolean): Promise<void> {
    let item: Cargo

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isArchive }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async search(payload: CargoSearchValidator['schema']['props']): Promise<JSONPaginate> {
    let query = Cargo
      .query()
      .withScopes((scopes) => scopes.notTemplate())
      .withScopes((scopes) => scopes.getByIsArchive(false))
    const config: PaginateConfig<Cargo> = {
      page: payload.page,
      limit: payload.limit,
      orderBy: payload.orderBy,
      orderByColumn: payload.orderByColumn,
    }

    try {
      for (const key in payload) {
        if (payload[key]) {
          switch (key) {
            case 'width':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.moreThanWidth(payload[key]))
              })

              break

            case 'height':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.moreThanHeight(payload[key]))
              })

              break

            case 'length':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.moreThanLength(payload[key]))
              })

              break

            case 'cargoItemTypeId':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.getByTypeId(payload[key]))
              })

              break

            case 'noteType':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.getByNoteType(payload[key]))
              })

              break

            case 'carryingTo':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.lessThanWeight(payload[key]))
              })

              break

            case 'carryingFrom':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.moreThanWeight(payload[key]))
              })

              break

            case 'capacityTo':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.lessThanCapacity(payload[key]))
              })

              break

            case 'capacityFrom':
              query = query.whereHas('items', (query) => {
                query.withScopes((scopes) => scopes.moreThanCapacity(payload[key]))
              })

              break

            case 'fromRoute':
              query = query.whereHas('loadings', (query) => {
                query.withScopes((scopes) => scopes.getByTown(payload[key]))
              })

              break

            case 'toRoute':
              query = query.whereHas('unloadings', (query) => {
                query.withScopes((scopes) => scopes.getByTown(payload[key]))
              })

              break

            default:
              break
          }
        }
      }

      const cargos: JSONPaginate = (await query.getViaPaginate(config)).toJSON()
      cargos.data = await Promise.all(cargos.data.map(async (item: Cargo) => item.getForUser()))

      return cargos
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async archiveOldRows(expire: NonNullable<ArchivingConfig['cargo']>): Promise<void> {
    let lastPage: number = 1
    const page: number = 1
    const limit: number = 30

    try {
      const testQuery: ModelPaginatorContract<Cargo> = await this.paginateOldRows({ page, limit }, expire)

      lastPage = testQuery.lastPage
    } catch (err: Err | any) {
      throw err
    }

    for (let i = page; i <= lastPage; i++) {
      let cargos: ModelPaginatorContract<Cargo>
      const config: PaginateConfig<Cargo> = {
        limit,
        page: i,
      }

      try {
        cargos = await this.paginateOldRows(config, expire)
      } catch (err: Err | any) {
        throw err
      }

      try {
        await Promise.all(cargos.map(async (item: Cargo) => {
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

  private static async paginateOldRows(config: PaginateConfig<Cargo>, expire: NonNullable<ArchivingConfig['cargo']>): Promise<ModelPaginatorContract<Cargo>> {
    const expirationDate: DateTime = DateTime.now().minus(ms(expire))

    try {
      return await Cargo
        .query()
        .withScopes((scopes) => scopes.notTemplate())
        .withScopes((scopes) => scopes.getByIsArchive(false))
        .withScopes((scopes) => scopes.getForArchiving(expirationDate))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
