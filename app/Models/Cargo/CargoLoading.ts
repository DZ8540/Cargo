// * Types
import type Cargo from './Cargo'
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class CargoLoading extends BaseModel {
  public static readonly table: string = TABLES_NAMES.CARGOS_LOADINGS
  public static readonly columns = [
    'id', 'type', 'isAllDay', 'town',
    'address', 'date', 'days', 'periodType',
    'timeFrom', 'timeTo', 'cargoId', 'createdAt',
    'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: boolean

  @column()
  public isAllDay: boolean

  @column()
  public town: string

  @column()
  public address: string

  @column.date()
  public date?: DateTime

  @column()
  public days?: number

  @column()
  public periodType?: number

  @column()
  public timeFrom?: string

  @column()
  public timeTo?: string

  /**
   * * Foreign keys
   */

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

  public static getByTown = scope((query, town: string) => {
    query.where('town', 'ILIKE', `${town}%`)
  })

  public static getByCargoId = scope((query, cargoId: Cargo['id']) => {
    query.where('cargo_id', cargoId)
  })
}
