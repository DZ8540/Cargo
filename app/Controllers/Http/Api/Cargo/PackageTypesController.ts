// * Types
import type { Err } from 'Contracts/response'
import type CargoItemPackageType from 'App/Models/Cargo/CargoItemPackageType'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import CargoItemPackageTypeService from 'App/Services/Cargo/CargoItemPackageTypeService'
import { ResponseMessages } from 'Config/response'

export default class PackageTypesController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const packageTypes: CargoItemPackageType[] = await CargoItemPackageTypeService.getAll()

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, packageTypes))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
