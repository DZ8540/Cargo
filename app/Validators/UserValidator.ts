// * Types
import type User from 'App/Models/User/User'
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { getRoleIdRules } from './Rules/User/role'
import { schema } from '@ioc:Adonis/Core/Validator'
import {
  getUserAvatarOptions, getUserCityRules, getUserCompanyNameRules, getUserEmailRules,
  getUserFirstNameRules, getUserLastNameRules, getUserPhoneRules, getUserTaxIdentificationNumberRules,
} from './Rules/User/user'

export default class UserValidator extends IndexValidator {
  private readonly currentUserId: User['id'] | null = this.ctx.params.id ?? null

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
    subject: schema.boolean(),
    email: schema.string({ trim: true }, getUserEmailRules('unique', this.currentUserId)),

    roleId: schema.number(getRoleIdRules({ isWithoutAdmin: true, withUniqueOrExists: 'exists' })),

    /**
     * * Optional schemes
     */

    lastName: schema.string.optional({ trim: true }, getUserLastNameRules()),
    firstName: schema.string.optional({ trim: true }, getUserFirstNameRules()),

    avatar: schema.file.optional(getUserAvatarOptions()),
    city: schema.string.optional({ trim: true }, getUserCityRules()),
    phone: schema.string.optional({ trim: true }, getUserPhoneRules(true, this.currentUserId)),

    companyName: schema.string.optional({ trim: true }, getUserCompanyNameRules(this.currentUserId)),
    taxIdentificationNumber: schema.number.optional(getUserTaxIdentificationNumberRules('unique', this.currentUserId)),
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
