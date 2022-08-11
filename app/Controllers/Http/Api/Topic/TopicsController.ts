// * Types
import type User from 'App/Models/User/User'
import type Topic from 'App/Models/Topic/Topic'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import UserService from 'App/Services/User/UserService'
import ResponseService from 'App/Services/ResponseService'
import TopicService from 'App/Services/Topic/TopicService'
import ExceptionService from 'App/Services/ExceptionService'
import TopicValidator from 'App/Validators/Topic/TopicValidator'
import TopicLikeService from 'App/Services/Topic/TopicLikeService'
import TopicMessageService from 'App/Services/Topic/TopicMessageService'
import TopicLikeValidator from 'App/Validators/Topic/TopicLikeValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Statistics = {
  topicCount: number,
  messagesCount: number,
  usersWithTopics: number,
  lastTopicTitle: Topic['title'],
}

export default class TopicsController {
  public async paginate({ request, response }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const topics: ModelPaginatorContract<Topic> = await TopicService.paginate(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, topics))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUserTopics({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const userId: User['id'] = params.userId

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const topics: ModelPaginatorContract<Topic> = await TopicService.paginateUserTopics(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, topics))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ response, params }: HttpContextContract) {
    const id: Topic['id'] = params.id
    const userId: User['id'] | undefined = params.userId

    try {
      let item: Topic | ModelObject = await TopicService.get(id)

      if (userId)
        item = await item.getForUser(userId)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: TopicValidator['schema']['props']

    try {
      payload = await request.validate(TopicValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Topic = await TopicService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createLike({ request, response }: HttpContextContract) {
    let payload: TopicLikeValidator['schema']['props']

    try {
      payload = await request.validate(TopicLikeValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await TopicLikeService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async search({ request, response }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const query: string = request.input('query', '')

    try {
      payload = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const topics: ModelPaginatorContract<Topic> = await TopicService.search(query, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, topics))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async getStatistics({ response }: HttpContextContract) {
    const statistics: Statistics = {
      topicCount: 0,
      messagesCount: 0,
      usersWithTopics: 0,
      lastTopicTitle: '',
    }

    try {
      const lastTopic: Topic = (await TopicService.paginate({
        page: 1,
        limit: 1,
        orderBy: 'desc',
        orderByColumn: undefined
      }))[0]

      statistics.topicCount = await TopicService.getCount()
      statistics.messagesCount = await TopicMessageService.getCount()
      statistics.usersWithTopics = await UserService.getUsersWithTopicsCount()
      statistics.lastTopicTitle = lastTopic.title

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, statistics))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
