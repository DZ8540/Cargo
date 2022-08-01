// * Types
import type CarBodyType from './Car/CarBodyType'
import type { DateTime } from 'luxon'
import { BelongsTo, HasMany, hasMany, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Car from './Car/Car'
import User from './User/User'
import RouteOrCargoContact from './RouteOrCargoContact'
import CarBodyTypeService from 'App/Services/Car/CarBodyTypeService'
import {
  BaseModel, beforeFetch, beforeFind,
  belongsTo, column, scope
} from '@ioc:Adonis/Lucid/Orm'

export default class Route extends BaseModel {
  public readonly columns = [
    'id', 'isArchive', 'fromRoute', 'toRoute',
    'dateType', 'bargainType', 'calculateType', 'loadingRadius',
    'unloadingRadius', 'date', 'dateDays', 'datePeriodType',
    'vatPrice', 'noVatPrice', 'prepayment', 'userId',
    'carId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isArchive: boolean

  @column()
  public fromRoute: string

  @column()
  public toRoute: string

  @column()
  public dateType: boolean

  @column()
  public bargainType: boolean

  @column()
  public calculateType: boolean

  @column()
  public loadingRadius?: number

  @column()
  public unloadingRadius?: number

  @column.date()
  public date?: DateTime

  @column()
  public dateDays?: number

  @column()
  public datePeriodType?: number

  @column()
  public vatPrice?: number

  @column()
  public noVatPrice?: number

  @column()
  public prepayment?: number

  @column()
  public note?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'car_id' })
  public carId: Car['id']

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

  @belongsTo(() => Car)
  public car: BelongsTo<typeof Car>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => RouteOrCargoContact)
  public contacts: HasMany<typeof RouteOrCargoContact>

  /**
   * * Query scopes
   */

  public static inArchive = scope((query) => {
    query.where('isArchive', true)
  })

  public static notInArchive = scope((query) => {
    query.where('isArchive', false)
  })

  public static getByCity = scope((query, city: string) => {
    query
      .where('fromRoute', 'ILIKE', `${city}%`)
      .orWhere('toRoute', 'ILIKE', `${city}%`)
  })

  public static getByFromRoute = scope((query, city: string) => {
    query.where('fromRoute', 'ILIKE', `${city}%`)
  })

  public static getByToRoute = scope((query, city: string) => {
    query.where('toRoute', 'ILIKE', `${city}%`)
  })

  public static getByUserId = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Route>) {
    query
      .preload('car')
      .preload('user')
      .preload('contacts')
  }

  /**
   * * Other
   */

  public async getForUser(): Promise<ModelObject> {
    const item: ModelObject = { ...this.toJSON() }

    const carBodyType: CarBodyType = await CarBodyTypeService.get(this.car.carBodyTypeId)
    item.carBodyType = carBodyType

    return item
  }
}
