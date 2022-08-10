// * Types
import type User from '../User/User'
import type TopicMessage from './TopicMessage'
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class TopicMessageLike extends BaseModel {
  public static readonly table: string = TABLES_NAMES.TOPICS_MESSAGES_LIKES
  public static readonly columns = ['id', 'isLike', 'userId', 'topicMessageId', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isLike: boolean

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'topicMessage_id' })
  public topicMessageId: TopicMessage['id']

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

  public static getByUserIdAndTopicMessageId = scope((query, userId: User['id'], topicMessageId: TopicMessage['id']) => {
    query
      .where('user_id', userId)
      .where('topicMessage_id', topicMessageId)
  })

  public static likes = scope((query) => {
    query.where('isLike', true)
  })

  public static dislikes = scope((query) => {
    query.where('isLike', false)
  })
}
