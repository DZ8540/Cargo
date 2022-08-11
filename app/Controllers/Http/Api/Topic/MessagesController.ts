// * Types
import type User from 'App/Models/User/User'
import type Topic from 'App/Models/Topic/Topic'
import type TopicMessage from 'App/Models/Topic/TopicMessage'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import TopicMessageService from 'App/Services/Topic/TopicMessageService'
import TopicMessageValidator from 'App/Validators/Topic/TopicMessageValidator'
import TopicMessageLikeService from 'App/Services/Topic/TopicMessageLikeService'
import TopicMessageLikeValidator from 'App/Validators/Topic/TopicMessageLikeValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class MessagesController {
  public async paginate({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const topicId: Topic['id'] = params.topicId
    const userId: User['id'] | undefined = params.userId

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
      let messages: ModelPaginatorContract<TopicMessage> | JSONPaginate = await TopicMessageService.paginate(topicId, payload)

      if (userId) {
        messages = messages.toJSON()

        messages.data = await Promise.all(messages.data.map(async (item: TopicMessage) => await item.getForUser(userId)))
      }

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, messages))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateLastMessages({ request, response }: HttpContextContract) {
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
      let messages: ModelPaginatorContract<TopicMessage> | JSONPaginate = await TopicMessageService.paginateLastMessages(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, messages))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: TopicMessageValidator['schema']['props']

    try {
      payload = await request.validate(TopicMessageValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: TopicMessage = await TopicMessageService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createLike({ request, response }: HttpContextContract) {
    let payload: TopicMessageLikeValidator['schema']['props']

    try {
      payload = await request.validate(TopicMessageLikeValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await TopicMessageLikeService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
