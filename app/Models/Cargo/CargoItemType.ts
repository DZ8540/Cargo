// * Types
import type { DateTime } from 'luxon'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoItem from './CargoItem'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class CargoItemType extends BaseModel {
  public static readonly table: string = TABLES_NAMES.CARGOS_ITEMS_TYPES
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

  @hasMany(() => CargoItem)
  public cargoItem: HasMany<typeof CargoItem>
}
