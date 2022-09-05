// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import CargoValidator from '../Cargo/CargoValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import { getTemplateNameRules, getTemplateNoteRules } from '../Rules/template'

export default class CargoTemplateValidator extends CargoValidator {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
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
    templateName: schema.string({ trim: true }, getTemplateNameRules()),

    /**
     * * Optional schemes
     */

    templateNote: schema.string.nullable({ trim: true }, getTemplateNoteRules()),

    /**
     * * Cargo
     */

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
