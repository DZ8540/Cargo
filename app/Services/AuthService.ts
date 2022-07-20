// * Types
import type User from 'App/Models/User/User'
import type ApiLoginValidator from 'App/Validators/Auth/ApiLoginValidator'
import type RegisterValidator from 'App/Validators/Auth/Register/RegisterValidator'
import type CodeVerifyValidator from 'App/Validators/Auth/Register/CodeVerifyValidator'
import type EmailVerifyValidator from 'App/Validators/Auth/Register/EmailVerifyValidator'
import type { Err } from 'Contracts/response'
import type { AuthHeaders } from 'Contracts/auth'
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
import type { SignTokenConfig, Tokens, UserTokenPayload } from 'Contracts/token'
// * Types

import authConfig from 'Config/auth'
import Hash from '@ioc:Adonis/Core/Hash'
import RedisService from './RedisService'
import TokenService from './TokenService'
import MailerService from './MailerService'
import UserService from './User/UserService'
import { RedisKeys } from 'Config/redis'
import { getRandom } from 'Helpers/index'
import { ResponseCodes, ResponseMessages } from 'Config/response'

type LoginViaAPIReturnData = {
  user: User,
  tokens: Tokens,
}

export default class AuthService {
  public static async loginViaAPI(payload: ApiLoginValidator['schema']['props'], headers: AuthHeaders): Promise<LoginViaAPIReturnData> {
    let user: User

    try {
      user = await UserService.get(payload.email)

      if (!(await Hash.verify(user.password, payload.password)))
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Err
    } catch (err: Err | any) {
      throw err
    }

    try {
      const tokens: Tokens = this.createTokens(user)

      await TokenService.createUserTokenSession(user.id, tokens.refresh, headers)

      return { user, tokens }
    } catch (err: Err | any) {
      throw err
    }
  }

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

  /**
   * * Private methods
   */

  private static createTokens(user: User): Tokens {
    const payload: UserTokenPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      subject: user.subject,
    }

    return {
      access: this.createAccessToken(payload),
      refresh: this.createRefreshToken(payload)
    }
  }

  private static createAccessToken(payload: UserTokenPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.access.key,
      expiresIn: authConfig.access.expire,
    }

    return TokenService.createToken(payload, config)
  }

  private static createRefreshToken(payload: UserTokenPayload): string {
    const config: SignTokenConfig = {
      key: authConfig.refresh.key,
      expiresIn: authConfig.refresh.expire,
    }

    return TokenService.createToken(payload, config)
  }
}
