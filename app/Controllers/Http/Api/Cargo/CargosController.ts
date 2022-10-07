// * Types
import type User from 'App/Models/User/User'
import type Cargo from 'App/Models/Cargo/Cargo'
import type CargoLoadingType from 'App/Models/Cargo/CargoLoadingType'
import type { Err } from 'Contracts/response'
import type { JSONPaginate } from 'Contracts/database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ApiValidator from 'App/Validators/ApiValidator'
import UserService from 'App/Services/User/UserService'
import CargoService from 'App/Services/Cargo/CargoService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import CargoValidator from 'App/Validators/Cargo/CargoValidator'
import CargoLoadingService from 'App/Services/Cargo/CargoLoadingService'
import CargoSearchValidator from 'App/Validators/Cargo/CargoSearchValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CargosController {
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
      const routes: JSONPaginate = await CargoService.paginateByCity(city, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateUserCargos({ request, response, params }: HttpContextContract) {
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
      const cargos: JSONPaginate = await CargoService.paginateUserCargos(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, cargos))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async paginateArchiveUserCargos({ request, response, params }: HttpContextContract) {
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
      const cargos: JSONPaginate = await CargoService.paginateArchiveUserCargos(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, cargos))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ response, params }: HttpContextContract) {
    const id: Cargo['id'] = params.id
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      const item: Cargo = await CargoService.get(id)

      try {
        if (!currentUserId)
          throw null

        await UserService.checkTariff(currentUserId)
      } catch (err: Err | any) {
        item.user.phone = undefined
      }

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: CargoValidator['schema']['props']

    try {
      payload = await request.validate(CargoValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await CargoService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: CargoValidator['schema']['props']
    const id: Cargo['id'] = params.id

    try {
      payload = await request.validate(CargoValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const item: Cargo = await CargoService.update(id, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, item))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const id: Cargo['id'] = params.id

    try {
      await CargoService.delete(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async unArchive({ response, params }: HttpContextContract) {
    const id: Cargo['id'] = params.id

    try {
      await CargoService.unArchive(id)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async count({ response }: HttpContextContract) {
    try {
      const count: number = await ResponseService.getCompletedCargoResponsesCount()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, count))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async search({ request, response }: HttpContextContract) {
    let payload: CargoSearchValidator['schema']['props']

    try {
      payload = await request.validate(CargoSearchValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const routes: JSONPaginate = await CargoService.search(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, routes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllLoadingTypes({ response }: HttpContextContract) {
    try {
      const types: CargoLoadingType[] = await CargoLoadingService.getAllLoadingTypes()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, types))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
