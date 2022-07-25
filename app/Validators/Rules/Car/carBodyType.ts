// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'

export function getCarBodyTypeIdRules(table: string = TABLES_NAMES.CAR_BODY_TYPES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}
