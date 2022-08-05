// * Types
import type Route from 'App/Models/Route'
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import RouteService from 'App/Services/RouteService'
import ApiValidator from 'App/Validators/ApiValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RouteValidator from 'App/Validators/Route/RouteValidator'
import RouteSearchValidator from 'App/Validators/Route/RouteSearchValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class RoutesController {
  public async paginate({ request, response, params }: HttpContextContract) {
    let payload: ApiValidator['schema']['props']
    const city: string = decodeURIComponent(params.city)

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
      const routes: JSONPaginate = await RouteService.paginateByCity(city, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUserRoutes({ request, response, params }: HttpContextContract) {
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
      const routes: JSONPaginate = await RouteService.paginateUserRoutes(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateArchiveUserRoutes({ request, response, params }: HttpContextContract) {
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
      const routes: JSONPaginate = await RouteService.paginateArchiveUserRoutes(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ response, params }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      const item: Route = await RouteService.get(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: RouteValidator['schema']['props']

    try {
      payload = await request.validate(RouteValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Route = await RouteService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: RouteValidator['schema']['props']
    const id: Route['id'] = params.id

    try {
      payload = await request.validate(RouteValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Route = await RouteService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      await RouteService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async count({ response }: HttpContextContract) {
    try {
      const count: number = await RouteService.getCount()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, count))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async unArchive({ response, params }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      await RouteService.unArchive(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async search({ request, response }: HttpContextContract) {
    let payload: RouteSearchValidator['schema']['props']

    try {
      payload = await request.validate(RouteSearchValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const routes: JSONPaginate = await RouteService.search(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
