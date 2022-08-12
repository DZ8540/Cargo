// * Types
import type { DateTime } from 'luxon'
import type { Err } from 'Contracts/response'
import type { BelongsTo, HasMany, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Topic from './Topic'
import User from '../User/User'
import TopicMessageLike from './TopicMessageLike'
import TopicMessageLikeService from 'App/Services/Topic/TopicMessageLikeService'
import { TABLES_NAMES } from 'Config/database'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class TopicMessage extends BaseModel {
  public static readonly table: string = TABLES_NAMES.TOPICS_MESSAGES
  public static readonly columns = [
    'id', 'description', 'userId',
    'topicId', 'topicMessageId',
    'createdAt', 'updatedAt'
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'topic_id' })
  public topicId: Topic['id']

  @column({ columnName: 'topicMessage_id' })
  public topicMessageId?: TopicMessage['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Aggregates columns
   */

  @column({ columnName: 'likes_count' })
  public likesCount?: number

  @column({ columnName: 'dislikes_count' })
  public dislikesCount?: number

  /**
   * * Relations
   */

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Topic)
  public topic: BelongsTo<typeof Topic>

  @belongsTo(() => TopicMessage)
  public message: BelongsTo<typeof TopicMessage>

  @hasMany(() => TopicMessageLike, {
    onQuery(query) {
      query.withScopes((scopes) => scopes.likes())
    },
  })
  public likes: HasMany<typeof TopicMessageLike>

  @hasMany(() => TopicMessageLike, {
    onQuery(query) {
      query.withScopes((scopes) => scopes.dislikes())
    },
  })
  public dislikes: HasMany<typeof TopicMessageLike>

  /**
   * * Query scopes
   */

  public static getByTopicId = scope((query, topicId: Topic['id']) => {
    query.where('topic_id', topicId)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof TopicMessage>) {
    query
      .preload('user')
      .preload('message')
      .withCount('likes')
      .withCount('dislikes')
  }

  /**
   * * Other
   */

  public async getForUser(userId: User['id']): Promise<ModelObject> {
    const item: ModelObject = { ...this.toJSON() }

    try {
      const like: TopicMessageLike = await TopicMessageLikeService.get(userId, this.id)
      item.likeStatus = like.isLike
    } catch (err: Err | any) {
      item.likeStatus = null
    }

    return item
  }
}
