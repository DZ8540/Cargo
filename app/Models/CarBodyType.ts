// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
