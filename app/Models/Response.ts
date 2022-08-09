// * Types
import type { DateTime } from 'luxon'
import { BelongsTo, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from './User/User'
import Route from './Route'
import Cargo from './Cargo/Cargo'
import { ResponsesStatusTypes } from 'Config/response'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Response extends BaseModel {
  public static readonly columns = ['id', 'status', 'userId', 'routeId', 'cargoId'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public status: ResponsesStatusTypes

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'route_id' })
  public routeId?: Route['id']

  @column({ columnName: 'cargo_id' })
  public cargoId?: Cargo['id']

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Route)
  public route: BelongsTo<typeof Route>

  @belongsTo(() => Cargo)
  public cargo: BelongsTo<typeof Cargo>

  /**
   * * Query scopes
   */

  public static getByStatus = scope((query, statusType: ResponsesStatusTypes) => {
    query.where('status', statusType)
  })

  public static getByUserId = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  public static getRoutes = scope((query) => {
    query.whereNotNull('route_id')
  })

  public static getCargo = scope((query) => {
    query.whereNotNull('cargo_id')
  })

  public static getByRoutesIds = scope((query, routesIds: Route['id'][]) => {
    query.whereIn('route_id', routesIds).whereNull('cargo_id')
  })

  public static getByCargoIds = scope((query, cargosIds: Cargo['id'][]) => {
    query.whereIn('cargo_id', cargosIds).whereNull('route_id')
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Response>) {
    query
      .preload('user')
      .preload('route')
      .preload('cargo')
  }
}
