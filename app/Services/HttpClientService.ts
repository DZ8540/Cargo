// * Types
import type { Err } from 'Contracts/response'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { TinkoffInitMethodPayload, TinkoffInitMethodResponse } from 'Contracts/payment'
// * Types

import axios from 'axios'
import Logger from '@ioc:Adonis/Core/Logger'
import { paymentConfig } from 'Config/payment'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class HttpClientService {
  private static tinkoffInstance: AxiosInstance = axios.create({
    baseURL: paymentConfig.tinkoff.apiUrl,
    headers: { 'Content-Type': 'application/json' },
  });

  public static async tinkoffInitMethod(payload: TinkoffInitMethodPayload | TinkoffInitMethodPayload<'phone'> | TinkoffInitMethodPayload<'email'>): Promise<TinkoffInitMethodResponse> {
    try {
      const response: AxiosResponse<TinkoffInitMethodResponse> = await this.tinkoffInstance.post('/Init', payload)

      return response.data
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
