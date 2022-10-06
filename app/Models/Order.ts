// * Types
import type User from './User/User'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { StatusTypes, TariffTypes } from 'Config/order'

export default class Order extends BaseModel {
  public static readonly columns = [
    'id',
    'statusType', 'tariffType',
    'price',
    'userId',
    'createdAt',' updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public statusType: StatusTypes

  @column()
  public tariffType: TariffTypes

  @column()
  public price: number

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
