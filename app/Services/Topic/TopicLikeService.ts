// * Types
import type User from 'App/Models/User/User'
import type Topic from 'App/Models/Topic/Topic'
import type TopicLikeValidator from 'App/Validators/Topic/TopicLikeValidator'
import type { Err } from 'Contracts/response'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import TopicLike from 'App/Models/Topic/TopicLike'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TopicLikeService {
  public static async create(payload: TopicLikeValidator['schema']['props']): Promise<void> {
    let isNotExists: boolean = false

    try {
      await this.update(payload)
    } catch (err: Err | any) {
      isNotExists = true
    }

    if (isNotExists) {
      try {
        await TopicLike.create(payload)
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
      }
    }
  }

  public static async get(userId: User['id'], topicId: Topic['id']): Promise<TopicLike> {
    let item: TopicLike | null

    try {
      item = await TopicLike
        .query()
        .withScopes((scopes) => scopes.getByUserIdAndTopicId(userId, topicId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  /**
   * * Private methods
   */

  private static async update(payload: TopicLikeValidator['schema']['props']): Promise<void> {
    let item: TopicLike

    try {
      item = await this.get(payload.userId, payload.topicId)
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
