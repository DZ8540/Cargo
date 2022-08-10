// * Types
import type User from 'App/Models/User/User'
import type ApiValidator from 'App/Validators/ApiValidator'
import type TopicValidator from 'App/Validators/Topic/TopicValidator'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import Topic from 'App/Models/Topic/Topic'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TopicService {
  public static async paginate(config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Topic>> {
    try {
      return await Topic.query().getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateUserTopics(userId: User['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Topic>> {
    try {
      return await Topic
        .query()
        .withScopes((scopes) => scopes.getByUserId(userId))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Topic['id']): Promise<Topic> {
    let item: Topic | null

    try {
      item = await Topic.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: TopicValidator['schema']['props']): Promise<Topic> {
    let id: Topic['id']

    try {
      id = (await Topic.create(payload)).id
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async search(query: string, config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Topic>> {
    try {
      return await Topic
        .query()
        .withScopes((scopes) => scopes.search(query))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async getCount(): Promise<number> {
    try {
      const topics: { total: number }[] = await Topic
        .query()
        .count('* as total')
        .pojo()

      return topics[0].total
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
