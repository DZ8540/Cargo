// * Types
import type User from '../User/User'
import type CarBodyType from './CarBodyType'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Car extends BaseModel {
  public static readonly columns = [
    'id', 'name', 'additionalConfiguration', 'carrying',
    'capacity', 'width', 'height', 'length',
    'sts', 'vin', 'pts', 'carBodyTypeId',
    'userId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public additionalConfiguration: number

  @column()
  public carrying: number

  @column()
  public capacity: number

  @column()
  public width: number

  @column()
  public height: number

  @column()
  public length: number

  @column()
  public sts?: string

  @column()
  public vin?: string

  @column()
  public pts?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'carBodyType_id' })
  public carBodyTypeId: CarBodyType['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

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

  public static getByUser = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })
}
