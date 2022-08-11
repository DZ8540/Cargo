// * Types
import type User from 'App/Models/User/User'
import type Response from 'App/Models/Response'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages, ResponsesStatusTypes } from 'Config/response'

export default class ResponsesController {
  public async complete({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.complete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async accept({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.accept(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async reject({ response, params }: HttpContextContract) {
    const id: Response['id'] = params.id

    try {
      await ResponseService.reject(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Incomings
   */

  public async paginateIncumingsRoutesResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateIncumingsRoutesResponses(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateIncumingsCargoResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateIncumingsCargoResponses(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Outgoings
   */

  public async paginateOutgoingsRoutesResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'route',
        statusType: ResponsesStatusTypes.UNDER_CONSIDERATION
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateOutgoingsCargoResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'cargo',
        statusType: ResponsesStatusTypes.UNDER_CONSIDERATION
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * In process
   */

  public async paginateInProcessRoutesResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'route',
        statusType: ResponsesStatusTypes.IN_PROCESS
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateInProcessCargoResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'cargo',
        statusType: ResponsesStatusTypes.IN_PROCESS
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Completed
   */

  public async paginateCompletedRoutesResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'route',
        statusType: ResponsesStatusTypes.COMPLETED
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateCompletedCargoResponses({ request, response, params }: HttpContextContract) {
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
      const responses: ModelPaginatorContract<Response> = await ResponseService.paginateUserResponses(userId, payload, {
        type: 'cargo',
        statusType: ResponsesStatusTypes.COMPLETED
      })

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, responses))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
