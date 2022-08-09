// * Types
import type Template from '../Template'
import type { DateTime } from 'luxon'
import type { BelongsTo, HasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from '../User/User'
import Report from '../Report'
import Response from '../Response'
import CargoItem from './CargoItem'
import CargoLoading from './CargoLoading'
import CarBodyType from '../Car/CarBodyType'
import CargoUnloading from './CargoUnloading'
import RouteOrCargoContact from '../RouteOrCargoContact'
import { BaseModel, column, hasMany, scope, belongsTo, beforeFetch, beforeFind } from '@ioc:Adonis/Lucid/Orm'

export default class Cargo extends BaseModel {
  public static readonly columns = [
    'id', 'isArchive', 'adr1', 'adr2',
    'adr3', 'adr4', 'adr5', 'adr6',
    'adr7', 'adr8', 'adr9', 'tir',
    'ekmt', 'bargainType', 'calculateType', 'fromTemperature',
    'toTemperature', 'vatPrice', 'noVatPrice', 'prepayment',
    'carBodyTypeId', 'userId', 'templateId',
    'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isArchive: boolean

  @column()
  public prepayment: number

  @column()
  public bargainType?: boolean

  @column()
  public calculateType?: boolean

  @column()
  public fromTemperature?: number

  @column()
  public toTemperature?: number

  @column()
  public vatPrice?: number

  @column()
  public noVatPrice?: number

  @column()
  public note?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'carBodyType_id' })
  public carBodyTypeId?: CarBodyType['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'template_id' })
  public templateId?: Template['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @belongsTo(() => CarBodyType)
  public carBodyType: BelongsTo<typeof CarBodyType>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => CargoLoading)
  public loadings: HasMany<typeof CargoLoading>

  @hasMany(() => CargoUnloading)
  public unloadings: HasMany<typeof CargoUnloading>

  @hasMany(() => CargoItem)
  public items: HasMany<typeof CargoItem>

  @hasMany(() => RouteOrCargoContact)
  public contacts: HasMany<typeof RouteOrCargoContact>

  @hasMany(() => Report)
  public reports: HasMany<typeof Report>

  @hasMany(() => Response)
  public responses: HasMany<typeof Response>

  /**
   * * Query scopes
   */

  public static notTemplate = scope((query) => {
    query.whereNull('template_id')
  })

  public static inArchive = scope((query) => {
    query.where('isArchive', true)
  })

  public static notInArchive = scope((query) => {
    query.where('isArchive', false)
  })

  public static getByCity = scope((query: ModelQueryBuilderContract<typeof Cargo>, city: string) => {
    query
      .whereHas('loadings', (query) => {
        query.where('town', 'ILIKE', `${city}%`)
      })
      .orWhereHas('unloadings', (query) => {
        query.where('town', 'ILIKE', `${city}%`)
      })
  })

  public static getByUserId = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Cargo>) {
    query
      .preload('user')
      .preload('items')
      .preload('loadings')
      .preload('contacts')
      .preload('unloadings')
      .preload('carBodyType')
  }

  /**
   * * Other
   */

  public async getForUser(): Promise<Cargo> {
    const those: Cargo = this

    await those.load('carBodyType')
    await those.load('loadings')
    await those.load('unloadings')
    await those.load('items')
    await those.load('contacts')
    await those.load('user')

    return those
  }
}
