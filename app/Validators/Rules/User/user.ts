// * Types
import type User from 'App/Models/User/User'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import {
  USER_PASSWORD_MAX_USERS_LENGTH, USER_PASSWORD_MIN_USERS_LENGTH,
  TABLES_NAMES, USER_FULL_NAME_MIN_USERS_LENGTH,
  USER_FULL_NAME_MAX_USERS_LENGTH
} from 'Config/database'

const TABLE: string = TABLES_NAMES.USERS

export function getUserEmailRules(withUniqueOrExists: 'unique' | 'exists' | false = false, currentUserId: User['id'] | null = null, table: string = TABLE): Rule[] {
  const rulesArr: Rule[] = [ rules.email() ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'email', whereNot: { id: currentUserId } }))
  else if (withUniqueOrExists == 'exists')
    rulesArr.push(rules.exists({ table, column: 'email' }))

  return rulesArr
}

export function getUserPasswordRules(isWithConfirm: boolean = false): Rule[] {
  const rulesArr: Rule[] = [
    rules.minLength(USER_PASSWORD_MIN_USERS_LENGTH),
    rules.maxLength(USER_PASSWORD_MAX_USERS_LENGTH),
    rules.containNumber(),
    rules.containUppercase(),
  ]

  if (isWithConfirm)
    rulesArr.push(rules.confirmed('passwordConfirm'))

  return rulesArr
}

export function getUserCompanyNameRules(currentUserId: User['id'] | null = null, table: string = TABLE): Rule[] {
  return [ rules.unique({ table, column: 'companyName', whereNot: { id: currentUserId } }) ]
}

export function getUserTaxIdentificationNumberRules(withUniqueOrExists: 'unique' | 'exists' | false = false, currentUserId: User['id'] | null = null, table: string = TABLE): Rule[] {
  const rulesArr: Rule[] = [ rules.unsigned() ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'taxIdentificationNumber', whereNot: { id: currentUserId } }))
  else if (withUniqueOrExists == 'exists')
    rulesArr.push(rules.exists({ table, column: 'taxIdentificationNumber' }))

  return rulesArr
}

export function getUserFirstNameRules(): Rule[] {
  return [
    rules.minLength(USER_FULL_NAME_MIN_USERS_LENGTH),
    rules.maxLength(USER_FULL_NAME_MAX_USERS_LENGTH),
  ]
}

export function getUserLastNameRules(): Rule[] {
  return getUserFirstNameRules()
}

export function getUserPhoneRules(isWithUnique: boolean = false, currentUserId: User['id'] | null = null, table: string = TABLE): Rule[] {
  const rulesArr: Rule[] = [ rules.mobile({ strict: true }) ]

  if (isWithUnique)
    rulesArr.push(rules.unique({ table, column: 'phone', whereNot: { id: currentUserId } }))

  return rulesArr
}

export function getUserCityRules(): Rule[] {
  return [ rules.minLength(2) ]
}

export function getUserAvatarOptions() {
  return {
    size: '1mb',
    extnames: ['jpg', 'png', 'jpeg'],
  }
}
