// * Types
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import QuestionService from 'App/Services/QuestionService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import QuestionValidator from 'App/Validators/QuestionValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class QuestionsController {
  public async create({ request, response }: HttpContextContract) {
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
