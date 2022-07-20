// * Types
import type { DateTime } from 'luxon'
// * Types

import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static readonly columns = [
    'id', 'email', 'password', 'subject',
    'firstName', 'lastName', 'phone', 'companyName',
    'taxIdentificationNumber', 'city', 'avatar', 'roleId',
    'createdAt', 'updatedAt', 'endAccessDate',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public subject: boolean

  @column()
  public firstName?: string

  @column()
  public lastName?: string

  @column()
  public phone?: string

  @column()
  public companyName?: string

  @column()
  public taxIdentificationNumber?: number

  @column()
  public city?: string

  @column()
  public avatar?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'role_id' })
  public roleId: number

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public endAccessDate?: DateTime

  /**
   * * Hooks
   */

  @beforeSave()
  public static async hashPasswordAndNicknameToLowercase(item: User) {
    if (item.$dirty.password)
      item.password = await Hash.make(item.password)
  }
}
