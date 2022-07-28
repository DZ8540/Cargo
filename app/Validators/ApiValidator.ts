// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

import IndexValidator from './IndexValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class ApiValidator extends IndexValidator {
  protected readonly preSchema = {
    page: schema.number([ rules.unsigned() ]),

    /**
     * * Optional schemes
     */

    limit: schema.number.optional([ rules.unsigned() ]),
    orderBy: schema.enum.optional(['asc', 'desc'] as const),
    orderByColumn: schema.string.optional({ trim: true }),
  }

  constructor() {
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
  public schema = schema.create(this.preSchema)

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
