// * Types
import type Car from 'App/Models/Car/Car'
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import CarService from 'App/Services/Car/CarService'
import ApiValidator from 'App/Validators/ApiValidator'
import CarValidator from 'App/Validators/CarValidator'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CarsController {
  public async paginate({ request, response, params }: HttpContextContract) {
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
      const cars: ModelPaginatorContract<Car> = await CarService.paginateUserCars(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, cars))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ response, params }: HttpContextContract) {
    const id: Car['id'] = params.id

    try {
      const item: Car = await CarService.get(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: CarValidator['schema']['props']

    try {
      payload = await request.validate(CarValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Car = await CarService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: CarValidator['schema']['props']
    const id: Car['id'] = params.id

    try {
      payload = await request.validate(CarValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Car = await CarService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id: Car['id'] = params.id

    try {
      await CarService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
