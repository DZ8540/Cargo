// * Types
import type User from '../User/User'
import type CarBodyType from './CarBodyType'
import type { DateTime } from 'luxon'
// * Types

import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, column, computed, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Car extends BaseModel {
  public static readonly columns = [
    'id', 'isVerified', 'name', 'additionalConfiguration',
    'capacity', 'width', 'height', 'length',
    'sts', 'vin', 'pts', 'carBodyTypeId',
    'carrying', 'userId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isVerified: boolean

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
   * * Computed properties
   */

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt?.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
  }

  @computed()
  public get isVerifiedForUser(): string {
    return Number(this.isVerified) ? 'Да' : 'Нет'
  }

  /**
   * * Query scopes
   */

  public static getByUser = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })
}
