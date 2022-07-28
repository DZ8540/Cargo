// * Types
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, beforeSave, column, scope } from '@ioc:Adonis/Lucid/Orm'
import { RolesNames } from 'Config/shield'

export default class Role extends BaseModel {
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
   * * Query scopes
   */

  public static notAdmin = scope((query) => {
    const roleNameToId: number = RolesNames.ADMIN + 1

    query.whereNot('id', roleNameToId)
  })

  /**
   * * Hooks
   */

  @beforeSave()
  public static nameToLowerCase(item: Role) {
    if (item.$dirty.name)
      item.name = item.name.toLowerCase()
  }
}
