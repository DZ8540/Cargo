// * Types
import type { CsvCity } from 'Contracts/cities'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { parse } from 'csv-parse/sync'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class CitiesController {
  public async getAll({ response }: HttpContextContract) {
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
}
