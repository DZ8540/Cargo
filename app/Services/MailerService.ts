// * Types
import type { Err } from 'Contracts/response'
// * Types

import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class MailerService {
  public static async sendRegisterVerificationCode(to: string, code: number): Promise<void> {
    try{
      await Mail.send((message) => {
        message
          .from('noreply@cargo.ru')
          .to(to)
          .subject(`${code} - ваш код подтверждения`)
          .htmlView('emails/registerVerify', { code })
      })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.MAILER_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
