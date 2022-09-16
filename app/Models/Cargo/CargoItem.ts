// * Types
import type Cargo from './Cargo'
import type { DateTime } from 'luxon'
import type { CargosItemsNoteTypes } from 'Config/cargo'
import type { BelongsTo, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import CargoItemType from './CargoItemType'
import CargoItemPackageType from './CargoItemPackageType'
import { TABLES_NAMES } from 'Config/database'
import { CARGOS_ITEMS_NOTE_TYPES } from 'Config/cargo'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, scope, computed } from '@ioc:Adonis/Lucid/Orm'

export default class CargoItem extends BaseModel {
  public static readonly table: string = TABLES_NAMES.CARGOS_ITEMS
  public static readonly columns = [
    'id', 'weight', 'capacity', 'packageCount',
    'length', 'width', 'height', 'noteType',
    'cargoItemTypeId', 'cargoItemPackageTypeId', 'cargoId', 'createdAt',
    'updatedAt',
  ]

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public weight: number

  @column()
  public capacity: number

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
  public packageCount?: number

  @column()
  public length?: number

  @column()
  public width?: number

  @column()
  public height?: number

  @column()
  public noteType?: CargosItemsNoteTypes | null

  /**
   * * Foreign keys
   */

  @column({ columnName: 'cargoItemType_id' })
  public cargoItemTypeId?: CargoItemType['id']

  @column({ columnName: 'cargoItemPackageType_id' })
  public cargoItemPackageTypeId?: CargoItemPackageType['id']

  @column({ columnName: 'cargo_id' })
  public cargoId?: Cargo['id']

  /**
   * * Timestamps
   */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Computed properties
   */

  @computed()
  public get noteTypeForUser(): typeof CARGOS_ITEMS_NOTE_TYPES[number] | 'Нет' {
    if (this.noteType !== undefined && this.noteType !== null)
      return CARGOS_ITEMS_NOTE_TYPES[this.noteType]
    else
      return 'Нет'
  }

  /**
   * * Relations
   */

  @belongsTo(() => CargoItemType)
  public type: BelongsTo<typeof CargoItemType>

  @belongsTo(() => CargoItemPackageType)
  public packageType: BelongsTo<typeof CargoItemPackageType>

  /**
   * * Query scopes
   */

  public static getByTypeId = scope((query, typeId: CargoItemType['id']) => {
    query.where('cargoItemType_id', typeId)
  })

  public static getByCargoId = scope((query, cargoId: Cargo['id']) => {
    query.where('cargo_id', cargoId)
  })

  public static getByNoteType = scope((query, noteType: CargosItemsNoteTypes) => {
    query.where('noteType', noteType)
  })

  public static moreThanWidth = scope((query, value: number) => {
    query.where('width', '>=', value)
  })

  public static moreThanHeight = scope((query, value: number) => {
    query.where('height', '>=', value)
  })

  public static moreThanLength = scope((query, value: number) => {
    query.where('length', '>=', value)
  })

  public static moreThanWeight = scope((query, value: number) => {
    query.where('weight', '>=', value)
  })

  public static lessThanWeight = scope((query, value: number) => {
    query.where('weight', '<=', value)
  })

  public static moreThanCapacity = scope((query, value: number) => {
    query.where('capacity', '>=', value)
  })

  public static lessThanCapacity = scope((query, value: number) => {
    query.where('capacity', '<=', value)
  })

  /**
   * * Hooks
   */

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof CargoItem>) {
    query
      .preload('type')
      .preload('packageType')
  }
}
