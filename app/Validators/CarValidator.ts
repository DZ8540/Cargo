// * Types
import type Car from 'App/Models/Car/Car'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { getUserIdRules } from './Rules/User/user'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getCarBodyTypeIdRules } from './Rules/Car/carBodyType'
import {
  getCarAdditionalConfigurationRules, getCarCapacityRules, getCarCarryingRules, getCarHeightRules,
  getCarLengthRules, getCarNameRules, getCarPtsRules, getCarStsRules,
  getCarVinRules, getCarWidthRules
} from './Rules/Car/car'

export default class CarValidator extends IndexValidator {
  private readonly currentId: Car['id'] | null = this.ctx.params.id ?? null

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
    name: schema.string({ trim: true }, getCarNameRules()),
    additionalConfiguration: schema.number(getCarAdditionalConfigurationRules()),

    width: schema.number(getCarWidthRules()),
    height: schema.number(getCarHeightRules()),
    length: schema.number(getCarLengthRules()),
    capacity: schema.number(getCarCapacityRules()),
    carrying: schema.number(getCarCarryingRules()),

    userId: schema.number(getUserIdRules()),
    carBodyTypeId: schema.number(getCarBodyTypeIdRules()),

    /**
     * * Optional schemes
     */

    sts: schema.string.optional({ trim: true }, getCarStsRules('unique', this.currentId)),
    vin: schema.string.optional({ trim: true }, getCarVinRules('unique', this.currentId)),
    pts: schema.string.optional({ trim: true }, getCarPtsRules('unique', this.currentId)),
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
