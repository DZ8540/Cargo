// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'

export function getCargoFromTemperatureRules(fieldName: string): Rule[] {
  return [
    rules.unsigned(),
    rules.beforeField(fieldName),
  ]
}

export function getCargoToTemperatureRules(fieldName: string): Rule[] {
  return [
    rules.unsigned(),
    rules.afterField(fieldName),
  ]
}

export function getCargoPriceRules(): Rule[] {
  return [ rules.unsigned() ]
}
