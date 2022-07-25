// * Types
import type CarBodyType from 'App/Models/Car/CarBodyType'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import CarBodyTypeService from 'App/Services/Car/CarBodyTypeService'
import { ResponseMessages } from 'Config/response'

export default class CarBodyTypesController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const bodyTypes: CarBodyType[] = await CarBodyTypeService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, bodyTypes))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
