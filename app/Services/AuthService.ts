// * Types
import type User from 'App/Models/User/User'
import type RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import type CodeVerifyValidator from 'App/Validators/Auth/CodeVerifyValidator'
import type EmailVerifyValidator from 'App/Validators/Auth/EmailVerifyValidator'
import type { Err } from 'Contracts/response'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import authConfig from 'Config/auth'
import RedisService from './RedisService'
import MailerService from './MailerService'
import UserService from './User/UserService'
import { RedisKeys } from 'Config/redis'
import { getRandom } from 'Helpers/index'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class AuthService {
  public static async emailVerify({ email }: EmailVerifyValidator['schema']['props']): Promise<void> {
    const code: number = getRandom(100000, 999999) // Only 6-digit code
    const redisKey: RedisKeys = RedisKeys.EMAIL_VERIFY

    try {
      await RedisService.set(redisKey, email, code, { expiration: authConfig.userVerifyExpire, safety: true })

      await MailerService.sendRegisterVerificationCode(email, code)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async codeVerify(payload: CodeVerifyValidator['schema']['props']): Promise<void> {
    const redisKey: RedisKeys = RedisKeys.EMAIL_VERIFY

    try {
      const candidateCode: string = await RedisService.get(redisKey, payload.email)

      if (Number(candidateCode) != payload.verifyCode)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.CODE_VERIFICATION_NOT_FOUND } as Err
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async registerViaAPI(payload: RegisterValidator['schema']['props']): Promise<User> {
    const userPayload: Partial<ModelAttributes<User>> = {
      email: payload.email,
      roleId: payload.roleId,
      password: payload.password,
    }

    try {
      await this.codeVerify(payload)

      await RedisService.remove(RedisKeys.EMAIL_VERIFY, payload.email) // @ts-ignore
      return await UserService.create(userPayload)
    } catch (err: Err | any) {
      throw err
    }
  }
}
