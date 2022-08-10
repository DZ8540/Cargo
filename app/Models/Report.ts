// * Types
import type Route from './Route'
import type User from './User/User'
import type Cargo from './Cargo/Cargo'
import type Topic from './Topic/Topic'
import type TopicMessage from './Topic/TopicMessage'
import type { DateTime } from 'luxon'
// * Types

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Report extends BaseModel {
  public static readonly columns = [
    'id', 'content', 'fromId', 'cargoId',
    'routeId', 'toId', 'createdAt', 'updatedAt'
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public content?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'from_id' })
  public fromId: User['id']

  @column({ columnName: 'route_id' })
  public routeId?: Route['id']

  @column({ columnName: 'cargo_id' })
  public cargoId?: Cargo['id']

  @column({ columnName: 'to_id' })
  public toId?: Cargo['id']

  @column({ columnName: 'topic_id' })
  public topicId?: Topic['id']

  @column({ columnName: 'topicMessage_id' })
  public topicMessageId?: TopicMessage['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
