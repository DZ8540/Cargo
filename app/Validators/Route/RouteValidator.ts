// * Types
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

import IndexValidator from '../IndexValidator'
import { getCarIdRules } from '../Rules/Car/car'
import { schema } from '@ioc:Adonis/Core/Validator'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { getUserIdRules } from '../Rules/User/user'
import {
  getRouteToRouteRules, getRouteFromRouteRules, getRouteLoadingRadiusRules, getRouteUnloadingRadiusRules,
  getRouteDateRules, getRouteDateDaysRules, getRouteDatePeriodTypeRules, getRoutePriceRules
} from '../Rules/route'

export default class RouteValidator extends IndexValidator {
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
    dateType: schema.boolean(),
    bargainType: schema.boolean(),
    calculateType: schema.boolean(),

    toRoute: schema.string({ trim: true }, getRouteToRouteRules()),
    fromRoute: schema.string({ trim: true }, getRouteFromRouteRules()),

    carId: schema.number(getCarIdRules()),
    userId: schema.number(getUserIdRules()),

    /**
     * * Optional schemes
     */

    vatPrice: schema.number.optional(getRoutePriceRules()),
    noVatPrice: schema.number.optional(getRoutePriceRules()),
    prepayment: schema.number.optional(getRoutePriceRules()),

    dateDays: schema.number.optional(getRouteDateDaysRules()),
    datePeriodType: schema.number.optional(getRouteDatePeriodTypeRules()),
    date: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }, getRouteDateRules()),

    loadingRadius: schema.number.optional(getRouteLoadingRadiusRules()),
    unloadingRadius: schema.number.optional(getRouteUnloadingRadiusRules()),
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
