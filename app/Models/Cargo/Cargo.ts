// * Types
import type User from '../User/User'
import type CarBodyType from '../Car/CarBodyType'
import type { DateTime } from 'luxon'
import type { HasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoItem from './CargoItem'
import CargoLoading from './CargoLoading'
import CargoUnloading from './CargoUnloading'
import RouteOrCargoContact from '../RouteOrCargoContact'
import { BaseModel, column, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Cargo extends BaseModel {
  public static readonly columns = [
    'id', 'isArchive', 'adr1', 'adr2',
    'adr3', 'adr4', 'adr5', 'adr6',
    'adr7', 'adr8', 'adr9', 'tir',
    'ekmt', 'bargainType', 'calculateType', 'fromTemperature',
    'toTemperature', 'vatPrice', 'noVatPrice', 'prepayment',
    'carBodyTypeId', 'userId', 'createdAt', 'updatedAt',
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public isArchive: boolean

  @column()
  public adr1: boolean

  @column()
  public adr2: boolean

  @column()
  public adr3: boolean

  @column()
  public adr4: boolean

  @column()
  public adr5: boolean

  @column()
  public adr6: boolean

  @column()
  public adr7: boolean

  @column()
  public adr8: boolean

  @column()
  public adr9: boolean

  @column()
  public tir: boolean

  @column()
  public ekmt: boolean

  @column()
  public bargainType: boolean

  @column()
  public calculateType: boolean

  @column()
  public fromTemperature?: number

  @column()
  public toTemperature?: number

  @column()
  public vatPrice?: number

  @column()
  public noVatPrice?: number

  @column()
  public prepayment?: number

  @column()
  public note?: string

  /**
   * * Foreign keys
   */

  @column({ columnName: 'carBodyType_id' })
  public carBodyTypeId?: CarBodyType['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Relations
   */

  @hasMany(() => CargoLoading)
  public loadings: HasMany<typeof CargoLoading>

  @hasMany(() => CargoUnloading)
  public unloadings: HasMany<typeof CargoUnloading>

  @hasMany(() => CargoItem)
  public items: HasMany<typeof CargoItem>

  @hasMany(() => RouteOrCargoContact)
  public contacts: HasMany<typeof RouteOrCargoContact>

  /**
   * * Query scopes
   */

  public static inArchive = scope((query) => {
    query.where('isArchive', true)
  })

  public static notInArchive = scope((query) => {
    query.where('isArchive', false)
  })

  public static getByCity = scope((query: ModelQueryBuilderContract<typeof Cargo>, city: string) => {
    query
      .whereHas('loadings', (query) => {
        query.where('town', 'ILIKE', `${city}%`)
      })
      .orWhereHas('unloadings', (query) => {
        query.where('town', 'ILIKE', `${city}%`)
      })
  })

  public static getByUserId = scope((query, userId: User['id']) => {
    query.where('user_id', userId)
  })

  /**
   * * Other
   */

  public async getForUser(): Promise<Cargo> {
    const those: Cargo = this

    await those.load('loadings')
    await those.load('unloadings')
    await those.load('items')
    await those.load('contacts')

    return those
  }
}
