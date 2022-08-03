// * Types
import type User from './User/User'
import type { DateTime } from 'luxon'
import type { HasOne, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Route from './Route'
import Cargo from './Cargo/Cargo'
import { BaseModel, beforeFetch, beforeFind, column, hasOne, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Template extends BaseModel {
  public static readonly columns = [
    'id', 'name', 'note', 'userId',
    'cargoId', 'routeId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public note?: string

  /**
   * * Foreign keys
   */

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
   * * Relations
   */

  @hasOne(() => Route)
  public route: HasOne<typeof Route>

  @hasOne(() => Cargo)
  public cargo: HasOne<typeof Cargo>

  /**
   * * Query scopes
   */

  public static routesTemplates = scope((query: ModelQueryBuilderContract<typeof Template>) => {
    query.has('route')
  })

  public static cargosTemplates = scope((query: ModelQueryBuilderContract<typeof Template>) => {
    query.has('cargo')
  })

  public static userTemplates = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Template>) {
    query
      .preload('route')
      .preload('cargo')
  }
}
