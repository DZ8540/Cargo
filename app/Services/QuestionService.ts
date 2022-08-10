// * Types
import type QuestionValidator from 'App/Validators/QuestionValidator'
import type { Err } from 'Contracts/response'
// * Types

import Question from 'App/Models/Question'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class QuestionService {
  public static async create(payload: QuestionValidator['schema']['props']): Promise<Question> {
    try {
      return await Question.create(payload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
