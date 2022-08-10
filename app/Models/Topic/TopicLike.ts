// * Types
import type Topic from './Topic'
import type User from '../User/User'
import type { DateTime } from 'luxon'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class TopicLike extends BaseModel {
  public static readonly table: string = TABLES_NAMES.TOPICS_LIKES
  public static readonly columns = ['id', 'isLike', 'userId', 'topicId', 'createdAt', 'updatedAt'] as const

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

  @column({ columnName: 'topic_id' })
  public topicId: Topic['id']

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

  public static getByUserIdAndTopicId = scope((query, userId: User['id'], topicId: Topic['id']) => {
    query
      .where('user_id', userId)
      .where('topic_id', topicId)
  })

  public static likes = scope((query) => {
    query.where('isLike', true)
  })

  public static dislikes = scope((query) => {
    query.where('isLike', false)
  })
}
