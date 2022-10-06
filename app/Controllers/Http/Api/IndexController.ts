// * Types
import type { CsvCity } from 'Contracts/cities'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import ResponseService from 'App/Services/ResponseService'
import QuestionService from 'App/Services/QuestionService'
import ExceptionService from 'App/Services/ExceptionService'
import QuestionValidator from 'App/Validators/QuestionValidator'
import { parse } from 'csv-parse/sync'
import { TARIFF_TYPES } from 'Config/order'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class IndexController {
  public async getAllCities({ response }: HttpContextContract) {
    try {
      const cities: string[] = []
      const csvCities: Buffer = fs.readFileSync(__dirname + '/../../../../city.csv')
      const parsedCities: CsvCity[] = parse(csvCities, { columns: true })

      let i: number = 1
      for (const item of parsedCities) {
        // Logger.info('Index:' + i)

        if (item.city)
          cities.push(item.city)
        i++
      }

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, cities))
    } catch (err: any) {
      Logger.error(err)
      throw new ExceptionService({
        code: ResponseCodes.SERVER_ERROR,
        message: ResponseMessages.ERROR,
      })
    }
  }

  public async getAllTariffs({ response }: HttpContextContract) {
    try {
      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, TARIFF_TYPES))
    } catch (err: any) {
      Logger.error(err)
      throw new ExceptionService({
        code: ResponseCodes.SERVER_ERROR,
        message: ResponseMessages.ERROR,
      })
    }
  }

  public async createQuestion({ request, response }: HttpContextContract) {
    let payload: QuestionValidator['schema']['props']

    try {
      payload = await request.validate(QuestionValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      await QuestionService.create(payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
