// * Types
import type CarBodyType from './Car/CarBodyType'
import type { DateTime } from 'luxon'
import type { RoutesDatePeriodTypes } from 'Config/route'
import type { BelongsTo, HasMany, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Car from './Car/Car'
import Report from './Report'
import User from './User/User'
import Template from './Template'
import Response from './Response'
import RouteOrCargoContact from './RouteOrCargoContact'
import CarBodyTypeService from 'App/Services/Car/CarBodyTypeService'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { ROUTES_DATE_PERIOD_TYPES } from 'Config/route'
import { ROUTES_BARGAIN_TYPES, ROUTES_CALCULATE_TYPES, ROUTES_LOADING_TYPE_TYPES } from 'Config/route'
import {
  BaseModel, beforeFetch, beforeFind,
  belongsTo, column, scope, hasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'

export default class Route extends BaseModel {
  public readonly columns = [
    'id', 'isArchive', 'fromRoute', 'toRoute',
    'dateType', 'bargainType', 'calculateType', 'loadingRadius',
    'unloadingRadius', 'date', 'dateDays', 'datePeriodType',
    'vatPrice', 'noVatPrice', 'prepayment', 'userId',
    'carId', 'templateId', 'createdAt', 'updatedAt',
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
  public prepayment: number

  @column()
  public bargainType?: boolean

  @column()
  public calculateType?: boolean

  @column()
  public loadingRadius?: number

  @column()
  public unloadingRadius?: number

  @column.date()
  public date?: DateTime

  @column()
  public dateDays?: number

  @column()
  public datePeriodType?: RoutesDatePeriodTypes

  @column()
  public vatPrice?: number

  @column()
  public noVatPrice?: number

  @column()
  public note?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'car_id' })
  public carId: Car['id']

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
   * * Computed properties
   */

  @computed()
  public get dateTypeForUser(): string {
    return ROUTES_LOADING_TYPE_TYPES[Number(this.dateType)]
  }

  @computed()
  public get datePeriodTypeForUser(): typeof ROUTES_DATE_PERIOD_TYPES[number] | 'Нет' {
    if (this.datePeriodType !== undefined && this.datePeriodType !== null)
      return ROUTES_DATE_PERIOD_TYPES[Number(this.datePeriodType)]
    else
      return 'Нет'
  }

  @computed()
  public get dateForUser(): string {
    return this.date ? this.date.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT) : ''
  }

  @computed()
  public get isArchiveForUser(): string {
    return this.isArchive ? 'Да' : 'Нет'
  }

  @computed()
  public get bargainTypeForUser(): string {
    if (this.bargainType !== undefined && this.bargainType !== null)
      return ROUTES_BARGAIN_TYPES[Number(this.bargainType)]
    else
      return ''
  }

  @computed()
  public get calculateTypeForUser(): string {
    if (this.calculateType !== undefined && this.calculateType !== null)
      return ROUTES_CALCULATE_TYPES[Number(this.calculateType)]
    else
      return ''
  }

  /**
   * * Relations
   */

  @belongsTo(() => Car)
  public car: BelongsTo<typeof Car>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Template)
  public template: BelongsTo<typeof Template>

  @hasMany(() => RouteOrCargoContact)
  public contacts: HasMany<typeof RouteOrCargoContact>

  @hasMany(() => Report)
  public reports: HasMany<typeof Report>

  @hasMany(() => Response)
  public responses: HasMany<typeof Response>

  /**
   * * Query scopes
   */

  public static getByCity = scope((query, city: string) => {
    query
      .where('fromRoute', 'ILIKE', `${city}%`)
      .orWhere('toRoute', 'ILIKE', `${city}%`)
  })

  public static getForArchiving = scope((query, date: DateTime) => {
    query
      .where('createdAt', '>', date.minus({ day: 1 }).toSQLDate())
      .andWhere('createdAt', '<', date.plus({ day: 1 }).toSQLDate())
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

  public static notTemplate = scope((query) => {
    query.whereNull('template_id')
  })

  public static getByIsArchive = scope((query, isArchive: Route['isArchive']) => {
    query.where('isArchive', isArchive)
  })

  public static getOnlyVerified = scope((query: ModelQueryBuilderContract<typeof Route>) => {
    query.whereHas('car', (query) => {
      query.withScopes((scopes) => scopes.onlyVerified())
    })
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
