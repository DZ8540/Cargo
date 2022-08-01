// * Types
import type Route from './Route'
import type Cargo from './Cargo/Cargo'
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class RouteOrCargoContact extends BaseModel {
  public static readonly table: string = TABLES_NAMES.ROUTES_OR_CARGOS_CONTACTS
  public static readonly columns = [
    'id', 'phone', 'firstName', 'note',
    'routeId', 'cargoId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public phone: string

  @column()
  public firstName: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'route_id' })
  public routeId: Route['id']

  @column({ columnName: 'cargo_id' })
  public cargoId: Cargo['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Query scopes
   */

  public static getByRouteId = scope((query, routeId: Route['id']) => {
    query.where('route_id', routeId)
  })

  public static getByCargoId = scope((query, cargoId: Cargo['id']) => {
    query.where('cargo_id', cargoId)
  })
}
