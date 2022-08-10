// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { getUserFirstNameRules, getUserIdRules, getUserPhoneRules } from '../Rules/User/user'
import { getCarBodyTypeIdRules } from '../Rules/Car/carBodyType'
import { getCargoUnloadingAddressRules, getCargoUnloadingTownRules } from '../Rules/Cargo/cargoUnloading'
import {
  getCargoFromTemperatureRules, getCargoNoteRules,
  getCargoPriceRules, getCargoToTemperatureRules,
} from '../Rules/Cargo/cargo'
import {
  getCargoLoadingAddressRules, getCargoLoadingTownRules,
  getCargoLoadingDaysRules, getCargoLoadingPeriodTypeRules,
} from '../Rules/Cargo/cargoLoading'
import {
  getCargoItemCapacityRules, getCargoItemHeightRules, getCargoItemLengthRules,
  getCargoItemNoteTypesRules, getCargoItemPackageCountRules, getCargoItemPackageTypeIdRules,
  getCargoItemTypeIdRules, getCargoItemWeightRules, getCargoItemWidthRules,
} from '../Rules/Cargo/cargoItem'
import { getCargoLoadingTypeIdRules } from '../Rules/Cargo/cargoLoadingType'

export default class CargoValidator extends IndexValidator {
  protected readonly loadingSchema = {
    type: schema.boolean(),
    isAllDay: schema.boolean(),

    town: schema.string({ trim: true }, getCargoLoadingTownRules()),
    address: schema.string({ trim: true }, getCargoLoadingAddressRules()),

    /**
     * * Optional schemes
     */

    date: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }),
    days: schema.number.optional(getCargoLoadingDaysRules()),
    periodType: schema.number.optional(getCargoLoadingPeriodTypeRules()),

    timeFrom: schema.date.optional({ format: 'HH:mm' }),
    timeTo: schema.date.optional({ format: 'HH:mm' }),

    transportationType: schema.boolean.optional(),

    cargoLoadingTypeId: schema.number.optional(getCargoLoadingTypeIdRules()),
  }

  protected readonly unloadingSchema = {
    isAllDay: schema.boolean(),
    town: schema.string({ trim: true }, getCargoUnloadingTownRules()),
    address: schema.string({ trim: true }, getCargoUnloadingAddressRules()),

    /**
     * * Optional schemes
     */

    dateFrom: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }),
    dateTo: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }),
    timeFrom: schema.date.optional({ format: 'HH:mm' }),
    timeTo: schema.date.optional({ format: 'HH:mm' }),

    cargoLoadingTypeId: schema.number.optional(getCargoLoadingTypeIdRules()),
  }

  protected readonly itemSchema = {
    weight: schema.number(getCargoItemWeightRules()),
    capacity: schema.number(getCargoItemCapacityRules()),

    adr1: schema.boolean(),
    adr2: schema.boolean(),
    adr3: schema.boolean(),
    adr4: schema.boolean(),
    adr5: schema.boolean(),
    adr6: schema.boolean(),
    adr7: schema.boolean(),
    adr8: schema.boolean(),
    adr9: schema.boolean(),
    tir: schema.boolean(),
    ekmt: schema.boolean(),

    /**
     * * Optional schemes
     */

    packageCount: schema.number.optional(getCargoItemPackageCountRules()),
    length: schema.number.optional(getCargoItemLengthRules()),
    width: schema.number.optional(getCargoItemWidthRules()),
    height: schema.number.optional(getCargoItemHeightRules()),
    noteType: schema.number.optional(getCargoItemNoteTypesRules()),

    cargoItemTypeId: schema.number.optional(getCargoItemTypeIdRules()),
    cargoItemPackageTypeId: schema.number.optional(getCargoItemPackageTypeIdRules()),
  }

  protected readonly preParsedSchema = {
    prepayment: schema.number(getCargoPriceRules()),
    userId: schema.number(getUserIdRules()),

    /**
     * * Optional schemes
     */

    bargainType: schema.boolean.optional(),
    calculateType: schema.boolean.optional(),

    fromTemperature: schema.number.optional(getCargoFromTemperatureRules()),
    toTemperature: schema.number.optional(getCargoToTemperatureRules()),

    vatPrice: schema.number.optional(getCargoPriceRules()),
    noVatPrice: schema.number.optional(getCargoPriceRules()),

    note: schema.string.optional({ trim: true }, getCargoNoteRules()),
    contacts: schema.array.optional().members(schema.object().members({
      phone: schema.string.optional({ trim: true }, getUserPhoneRules()),
      firstName: schema.string.optional({ trim: true }, getUserFirstNameRules()),
    })),

    carBodyTypeId: schema.number.optional(getCarBodyTypeIdRules()),
    templateId: schema.number.optional(getCarBodyTypeIdRules()),
  }

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /**
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    loadings: schema.array().members(schema.object().members({ ...this.loadingSchema })),
    unloadings: schema.array().members(schema.object().members({ ...this.unloadingSchema })),
    items: schema.array().members(schema.object().members({ ...this.itemSchema })),
    ...this.preParsedSchema,
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = this.messages
}
