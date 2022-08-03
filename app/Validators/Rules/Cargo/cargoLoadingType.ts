// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { TABLES_NAMES } from 'Config/database'

export function getCargoLoadingTypeIdRules(table: string = TABLES_NAMES.CARGOS_LOADINGS_TYPES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}
