// * Types
import type { DateTime } from 'luxon'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoLoading from './CargoLoading'
import CargoUnloading from './CargoUnloading'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class CargoLoadingType extends BaseModel {
  public static readonly table: string = TABLES_NAMES.CARGOS_LOADINGS_TYPES
  public static readonly columns = ['id', 'name', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @hasMany(() => CargoLoading)
  public loadings: HasMany<typeof CargoLoading>

  @hasMany(() => CargoUnloading)
  public unLoadings: HasMany<typeof CargoUnloading>
}
