// * Types
import type User from 'App/Models/User/User'
import type TopicMessage from 'App/Models/Topic/TopicMessage'
import type TopicMessageLikeValidator from 'App/Validators/Topic/TopicMessageLikeValidator'
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import TopicMessageLike from 'App/Models/Topic/TopicMessageLike'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TopicMessageLikeService {
  public static async get(userId: User['id'], topicMessageId: TopicMessage['id']): Promise<TopicMessageLike> {
    let item: TopicMessageLike | null

    try {
      item = await TopicMessageLike
        .query()
        .withScopes((scopes) => scopes.getByUserIdAndTopicMessageId(userId, topicMessageId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: TopicMessageLikeValidator['schema']['props']): Promise<void> {
    let isNotExists: boolean = false

    try {
      await this.update(payload)
    } catch (err: Err | any) {
      isNotExists = true
    }

    if (isNotExists) {
      try {
        await TopicMessageLike.create(payload)
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }
  }

  public static async delete({ userId, topicMessageId }: TopicMessageLikeValidator['schema']['props']): Promise<void> {
    let item: TopicMessageLike

    try {
      item = await this.get(userId, topicMessageId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async update(payload: TopicMessageLikeValidator['schema']['props']): Promise<void> {
    let item: TopicMessageLike

    try {
      item = await this.get(payload.userId, payload.topicMessageId)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge({ isLike: payload.isLike }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
