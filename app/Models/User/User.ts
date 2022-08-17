// * Types
import type { DateTime } from 'luxon'
import type { HasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Topic from '../Topic/Topic'
import Hash from '@ioc:Adonis/Core/Hash'
import { ROLES_NAMES } from 'Config/shield'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { BaseModel, beforeSave, column, computed, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static readonly columns = [
    'id', 'isBlocked', 'email', 'password',
    'firstName', 'lastName', 'phone', 'companyName',
    'taxIdentificationNumber', 'city', 'avatar', 'subject',
    'roleId', 'createdAt', 'updatedAt', 'endAccessDate',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isBlocked: boolean

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
  public avatar?: string | null

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
   * * Computed properties
   */

  @computed()
  public get fullName(): string {
    return `${this.lastName} ${this.firstName}`
  }

  @computed()
  public get subjectForUser(): string {
    return this.subject ? 'Юр. лицо' : 'Физ. лицо'
  }

  @computed()
  public get roleForUser(): string {
    const roleToArrIndex: number = this.roleId - 1

    return ROLES_NAMES[roleToArrIndex]
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt?.setLocale('ru-RU').toFormat(GLOBAL_DATETIME_FORMAT)
  }

  @computed()
  public get isBlockedForUser(): string {
    return Number(this.isBlocked) ? 'Да' : 'Нет'
  }

  /**
   * * Relations
   */

  @hasMany(() => Topic)
  public topics: HasMany<typeof Topic>

  /**
   * * Query scopes
   */

  public static withTopics = scope((query: ModelQueryBuilderContract<typeof User>) => {
    query.has('topics')
  })

  /**
   * * Hooks
   */

  @beforeSave()
  public static async hashPasswordAndNicknameToLowercase(item: User) {
    if (item.$dirty.password)
      item.password = await Hash.make(item.password)
  }
}
