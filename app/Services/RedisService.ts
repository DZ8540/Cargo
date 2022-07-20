// * Types
import type { Err } from 'Contracts/response'
// * Types

import ms from 'ms'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'
import { RedisKeys, REDIS_KEYS } from 'Config/redis'
import { ResponseCodes, ResponseMessages } from 'Config/response'

// Expiration in ms js
type Config = {
  safety?: boolean,
  expiration?: string,
}

export default class RedisService {
  public static async get(keyType: RedisKeys, key: string): Promise<string> {
    let item: string | null

    try {
      item = await Redis.get(this.getKey(keyType, key))
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.CODE_VERIFICATION_NOT_FOUND } as Err

    return item
  }

  public static async set(keyType: RedisKeys, key: string, value: any, config: Config): Promise<void> {
    if (config.safety) {
      const item: string | null = await Redis.get(this.getKey(keyType, key))

      if (item)
        throw { code: ResponseCodes.VERIFY_CODE_EXISTS, message: ResponseMessages.CODE_VERIFICATION_ALREADY_EXISTS } as Err
    }

    try {
      if (config.expiration)
        await Redis.set(this.getKey(keyType, key), value, 'PX', ms(config.expiration))
      else
        await Redis.set(this.getKey(keyType, key), value)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async remove(keyType: RedisKeys, key: string): Promise<void> {
    try {
      await Redis.del(this.getKey(keyType, key))
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  /**
   * * Private methods
   */

  private static getKey(keyType: RedisKeys, key: string): string {
    return `${REDIS_KEYS[keyType]}/${key}`
  }
}
