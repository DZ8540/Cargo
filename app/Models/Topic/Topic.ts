// * Types
import type { DateTime } from 'luxon'
import type { Err } from 'Contracts/response'
import type { BelongsTo, HasMany, HasOne, ModelObject, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import User from '../User/User'
import TopicLike from './TopicLike'
import TopicMessage from './TopicMessage'
import TopicLikeService from 'App/Services/Topic/TopicLikeService'
import {
  BaseModel, beforeFetch, beforeFind,
  belongsTo, column, hasMany,
  hasOne, scope
} from '@ioc:Adonis/Lucid/Orm'

export default class Topic extends BaseModel {
  public static readonly columns = ['id', 'title', 'description', 'userId', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

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
   * * Aggregates columns
   */

  @column({ columnName: 'messages_count' })
  public messagesCount?: number

  @column({ columnName: 'likes_count' })
  public likesCount?: number

  @column({ columnName: 'dislikes_count' })
  public dislikesCount?: number

  /**
   * * Relations
   */

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => TopicMessage, {
    onQuery(query) {
      query.orderBy('id', 'desc')
    },
  })
  public lastMessage: HasOne<typeof TopicMessage>

  @hasMany(() => TopicMessage)
  public messages: HasMany<typeof TopicMessage>

  @hasMany(() => TopicLike, {
    onQuery(query) {
      query.withScopes((scopes) => scopes.likes())
    },
  })
  public likes: HasMany<typeof TopicLike>

  @hasMany(() => TopicLike, {
    onQuery(query) {
      query.withScopes((scopes) => scopes.dislikes())
    },
  })
  public dislikes: HasMany<typeof TopicLike>

  /**
   * * Query scopes
   */

  public static getByUserId = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  public static search = scope((query, queryString: string) => {
    query.whereILike('title', `%${queryString}%`)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Topic>) {
    query
      .preload('user')
      .preload('lastMessage')
      .withCount('messages')
      .withCount('likes')
      .withCount('dislikes')
  }

  /**
   * * Other
   */

  public async getForUser(userId: User['id']): Promise<ModelObject> {
    const item: ModelObject = { ...this.toJSON() }

    try {
      const like: TopicLike = await TopicLikeService.get(userId, this.id)
      item.likeStatus = like.isLike
    } catch (err: Err | any) {
      item.likeStatus = null
    }

    return item
  }
}
