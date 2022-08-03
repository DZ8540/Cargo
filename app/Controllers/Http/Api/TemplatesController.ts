// * Types
import type User from 'App/Models/User/User'
import type Template from 'App/Models/Template'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import TemplateService from 'App/Services/TemplateService'
import ExceptionService from 'App/Services/ExceptionService'
import TemplateValidator from 'App/Validators/Template/TemplateValidator'
import CargoTemplateValidator from 'App/Validators/Template/CargoTemplateValidator'
import RouteTemplateValidator from 'App/Validators/Template/RouteTemplateValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TemplatesController {
  public async update({ request, response, params }: HttpContextContract) {
    let payload: TemplateValidator['schema']['props']
    const id: Template['id'] = params.id

    try {
      payload = await request.validate(TemplateValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await TemplateService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id: Template['id'] = params.id

    try {
      await TemplateService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Route
   */

  public async paginateForRoutes({ request, response, params }: HttpContextContract) {
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
      const templates: ModelPaginatorContract<Template> = await TemplateService.paginateRoutesTemplates(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, templates))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createRouteTemplate({ request, response }: HttpContextContract) {
    let payload: RouteTemplateValidator['schema']['props']

    try {
      payload = await request.validate(RouteTemplateValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await TemplateService.create(payload, 'route')

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  /**
   * * Cargo
   */

  public async paginateForCargos({ request, response, params }: HttpContextContract) {
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
      const templates: ModelPaginatorContract<Template> = await TemplateService.paginateCargosTemplates(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, templates))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createCargoTemplate({ request, response }: HttpContextContract) {
    let payload: CargoTemplateValidator['schema']['props']

    try {
      payload = await request.validate(CargoTemplateValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await TemplateService.create(payload, 'cargo')

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
