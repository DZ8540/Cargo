// * Types
import type Cargo from './Cargo'
import type { DateTime } from 'luxon'
import type { BelongsTo, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoLoadingType from './CargoLoadingType'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class CargoUnloading extends BaseModel {
  public static readonly table: string = TABLES_NAMES.CARGOS_UNLOADINGS
  public static readonly columns = [
    'id', 'isAllDay', 'town', 'address',
    'dateFrom', 'dateTo', 'timeFrom', 'timeTo',
    'cargoId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isAllDay: boolean

  @column()
  public town: string

  @column()
  public address: string

  @column.date()
  public dateFrom?: DateTime

  @column.date()
  public dateTo?: DateTime

  @column()
  public timeFrom?: string

  @column()
  public timeTo?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'cargo_id' })
  public cargoId: Cargo['id']

  @column({ columnName: 'cargoLoadingType_id' })
  public cargoLoadingTypeId?: CargoLoadingType['id']

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

  @belongsTo(() => CargoLoadingType)
  public loadingType: BelongsTo<typeof CargoLoadingType>

  /**
   * * Query scopes
   */

  public static getByTown = scope((query, town: string) => {
    query.where('town', 'ILIKE', `${town}%`)
  })

  public static getByCargoId = scope((query, cargoId: Cargo['id']) => {
    query.where('cargo_id', cargoId)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof CargoUnloading>) {
    query.preload('loadingType')
  }
}
