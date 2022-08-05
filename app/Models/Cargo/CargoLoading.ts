// * Types
import type Cargo from './Cargo'
import type { DateTime } from 'luxon'
import type { CargosLoadingPeriodTypes } from 'Config/cargo'
import type { BelongsTo, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoLoadingType from './CargoLoadingType'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'

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
  public periodType?: CargosLoadingPeriodTypes

  @column()
  public timeFrom?: string

  @column()
  public timeTo?: string

  @column()
  public transportationType?: boolean

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
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof CargoLoading>) {
    query.preload('loadingType')
  }
}
