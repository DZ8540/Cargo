// * Types
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import ReportService from 'App/Services/ReportService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import UserReportValidator from 'App/Validators/Report/UserReportValidator'
import CargoReportValidator from 'App/Validators/Report/CargoReportValidator'
import RouteReportValidator from 'App/Validators/Report/RouteReportValidator'
import TopicReportValidator from 'App/Validators/Report/TopicReportValidator'
import TopicMessageReportValidator from 'App/Validators/Report/TopicMessageReportValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ReportsController {
  public async createRouteReport({ request, response }: HttpContextContract) {
    let payload: RouteReportValidator['schema']['props']

    try {
      payload = await request.validate(RouteReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ReportService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createCargoReport({ request, response }: HttpContextContract) {
    let payload: CargoReportValidator['schema']['props']

    try {
      payload = await request.validate(CargoReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ReportService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createUserReport({ request, response }: HttpContextContract) {
    let payload: UserReportValidator['schema']['props']

    try {
      payload = await request.validate(UserReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ReportService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createTopicReport({ request, response }: HttpContextContract) {
    let payload: TopicReportValidator['schema']['props']

    try {
      payload = await request.validate(TopicReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ReportService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async createTopicMessageReport({ request, response }: HttpContextContract) {
    let payload: TopicMessageReportValidator['schema']['props']

    try {
      payload = await request.validate(TopicMessageReportValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await ReportService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
