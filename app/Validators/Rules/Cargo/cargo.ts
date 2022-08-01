// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { CARGO_NOTE_MAX_LENGTH, CARGO_NOTE_MIN_LENGTH } from 'Config/database'

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

export function getCargoNoteRules(): Rule[] {
  return [
    rules.minLength(CARGO_NOTE_MIN_LENGTH),
    rules.maxLength(CARGO_NOTE_MAX_LENGTH),
  ]
}
