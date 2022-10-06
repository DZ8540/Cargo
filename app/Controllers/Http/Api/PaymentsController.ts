// * Types
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { TinkoffInitMethodResponse, TinkoffWebHookPayload } from 'Contracts/payment'
// * Types

import PaymentService from 'App/Services/PaymentService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import BuyTariffValidator from 'App/Validators/BuyTariffValidator'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class PaymentsController {
  public async buyTariff({ request, response, params }: HttpContextContract) {
    const userId: User['id'] = params.userId
    let payload: BuyTariffValidator['schema']['props']

    try {
      payload = await request.validate(BuyTariffValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages,
      })
    }

    try {
      const paymentUrl: TinkoffInitMethodResponse['PaymentURL'] = await PaymentService.buyTariff(userId, payload)

      return response.status(200).send(new ResponseService(ResponseMessages.SUCCESS, paymentUrl))
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }

  public async buyTariffWebHook({ request }: HttpContextContract) {
    const payload: TinkoffWebHookPayload = request.all() as TinkoffWebHookPayload

    try {
      await PaymentService.buyTariffWebHook(payload)
    } catch (err: Err | any) {
      throw new ExceptionService(err)
    }
  }
}
