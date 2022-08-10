// * Types
import type UserReportValidator from 'App/Validators/Report/UserReportValidator'
import type RouteReportValidator from 'App/Validators/Report/RouteReportValidator'
import type CargoReportValidator from 'App/Validators/Report/CargoReportValidator'
import type TopicReportValidator from 'App/Validators/Report/TopicReportValidator'
import type TopicMessageReportValidator from 'App/Validators/Report/TopicMessageReportValidator'
import type { Err } from 'Contracts/response'
// * Types

import Report from 'App/Models/Report'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type Validators = (
  RouteReportValidator | CargoReportValidator |
  UserReportValidator | TopicReportValidator |
  TopicMessageReportValidator
)['schema']['props']

export default class ReportService {
  public static async create(payload: Validators): Promise<Report> {
    try {
      return await Report.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
