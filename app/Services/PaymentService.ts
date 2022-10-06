// * Types
import type Order from 'App/Models/Order'
import type User from 'App/Models/User/User'
import type { Err } from 'Contracts/response'
import type { TariffType } from 'Contracts/order'
import type {
  TinkoffWebHookPayload,
  TinkoffInitMethodPayload,
  TinkoffInitMethodResponse,
} from 'Contracts/payment'
// * Types

import OrderService from './OrderService'
import UserService from './User/UserService'
import Logger from '@ioc:Adonis/Core/Logger'
import HttpClientService from './HttpClientService'
import BuyTariffValidator from 'App/Validators/BuyTariffValidator'
import { paymentConfig } from 'Config/payment'
import { StatusTypes, TARIFF_TYPES } from 'Config/order'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class PaymentService {
  public static async buyTariff(userId: User['id'], { tariffType }: BuyTariffValidator['schema']['props']): Promise<NonNullable<TinkoffInitMethodResponse['PaymentURL']>> {
    let user: User
    let order: Order
    const tariff: TariffType = TARIFF_TYPES[tariffType]

    try {
      user = await UserService.get(userId)
      order = await OrderService.create(user.id, tariff.price, tariffType)
    } catch (err: Err | any) {
      throw err
    }

    try {
      const priceInPennies: number = tariff.price * 100
      const payload: TinkoffInitMethodPayload<'both'> = {
        TerminalKey: paymentConfig.tinkoff.terminalKey,
        Amount: priceInPennies,
        OrderId: String(order.id),
        PayType: 'O',
        Receipt: {
          Email: user.email,
          Phone: user.phone as string,

          Taxation: 'usn_income_outcome',
          Items: [{
            Name: tariff.name,

            Quantity: 1,
            Price: priceInPennies,
            Amount: 1 * priceInPennies, // Quantity * Price

            PaymentObject: 'service',
            PaymentMethod: 'full_payment',
            Tax: 'none',
          }],
        }
      }

      const response: TinkoffInitMethodResponse = await HttpClientService.tinkoffInitMethod(payload)
      if (!response.PaymentURL)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err

      return response.PaymentURL
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async buyTariffWebHook(payload: TinkoffWebHookPayload): Promise<void> {
    let orderId: Order['id']

    if (!payload.Status) {
      Logger.error(ResponseMessages.TINKOFF_WEB_HOOK_STATUS_NOT_DEFINED)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!payload.OrderId) {
      Logger.error(ResponseMessages.TINKOFF_WEB_HOOK_ORDER_NOT_DEFINED)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err
    } else {
      orderId = Number(payload.OrderId)
    }

    try {
      switch (payload.Status) {
        case 'CONFIRMED':
        case 'REJECTED':
        case 'REFUNDED':
          await OrderService.update(orderId, StatusTypes[payload.Status])
          break

        case 'AUTHORIZED':
        default:
          break;
      }
    } catch (err: Err | any) {
      throw err
    }
  }
}
