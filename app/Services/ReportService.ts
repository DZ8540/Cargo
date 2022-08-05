// * Types
import type UserReportValidator from 'App/Validators/Report/UserReportValidator'
import type RouteReportValidator from 'App/Validators/Report/RouteReportValidator'
import type CargoReportValidator from 'App/Validators/Report/CargoReportValidator'
import type { Err } from 'Contracts/response'
// * Types

import Report from 'App/Models/Report'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class ReportService {
  public static async create(payload: RouteReportValidator['schema']['props'] | CargoReportValidator['schema']['props'] | UserReportValidator['schema']['props']): Promise<Report> {
    try {
      return await Report.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
