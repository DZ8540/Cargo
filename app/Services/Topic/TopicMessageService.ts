// * Types
import type Topic from 'App/Models/Topic/Topic'
import type ApiValidator from 'App/Validators/ApiValidator'
import type TopicMessageValidator from 'App/Validators/Topic/TopicMessageValidator'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Logger from '@ioc:Adonis/Core/Logger'
import TopicMessage from 'App/Models/Topic/TopicMessage'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TopicMessageService {
  public static async paginate(topicId: Topic['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<TopicMessage>> {
    try {
      return await TopicMessage
        .query()
        .withScopes((scopes) => scopes.getByTopicId(topicId))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateLastMessages(config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<TopicMessage>> {
    try {
      return await TopicMessage
        .query()
        .preload('topic')
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async create(payload: TopicMessageValidator['schema']['props']): Promise<TopicMessage> {
    let id: TopicMessage['id']

    try {
      id = (await TopicMessage.create(payload)).id
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async getCount(): Promise<number> {
    try {
      const messages: { total: number }[] = await TopicMessage
        .query()
        .count('* as total')
        .pojo()

      return messages[0].total
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static async get(id: TopicMessage['id']): Promise<TopicMessage> {
    let item: TopicMessage | null

    try {
      item = await TopicMessage.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }
}
