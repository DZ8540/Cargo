// * Types
import type CargoItemType from 'App/Models/Cargo/CargoItemType'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { Err } from 'Contracts/response'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import CargoItemTypeService from 'App/Services/Cargo/CargoItemTypeService'
import { ResponseMessages } from 'Config/response'

export default class ItemsPackageTypesController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const types: CargoItemType[] = await CargoItemTypeService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, types))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
