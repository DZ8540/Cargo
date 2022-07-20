// * Types
import type User from 'App/Models/User/User'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { PASSWORD_MAX_USERS_LENGTH, PASSWORD_MIN_USERS_LENGTH, TABLES_NAMES } from 'Config/database'

export function getUserEmailRules(withUniqueOrExists: 'unique' | 'exists' | false = false, table: string = TABLES_NAMES.USERS, currentUserId: User['id'] | null = null): Rule[] {
  const rulesArr: Rule[] = [ rules.email() ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'email', whereNot: { id: currentUserId } }))
  else if (withUniqueOrExists == 'exists')
    rulesArr.push(rules.exists({ table, column: 'email' }))

  return rulesArr
}

export function getUserPasswordRules(isWithConfirm: boolean = false): Rule[] {
  const rulesArr: Rule[] = [
    rules.minLength(PASSWORD_MIN_USERS_LENGTH),
    rules.maxLength(PASSWORD_MAX_USERS_LENGTH),
    rules.containNumber(),
    rules.containUppercase(),
  ]

  if (isWithConfirm)
    rulesArr.push(rules.confirmed('passwordConfirm'))

  return rulesArr
}
