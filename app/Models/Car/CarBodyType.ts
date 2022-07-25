// * Types
import type { DateTime } from 'luxon'
import type { HasMany } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Car from './Car'
import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class CarBodyType extends BaseModel {
  public static readonly columns = [
    'id', 'name',
    'createdAt', 'updatedAt',
  ] as const

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

  @hasMany(() => Car, { foreignKey: 'carBodyTypeId' })
  public cars: HasMany<typeof Car>
}
