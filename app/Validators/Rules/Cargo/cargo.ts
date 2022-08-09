// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { CARGO_NOTE_MAX_LENGTH, CARGO_NOTE_MIN_LENGTH, TABLES_NAMES } from 'Config/database'

export function getCargoIdRules(table: string = TABLES_NAMES.CARGOS): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getCargoFromTemperatureRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoToTemperatureRules(): Rule[] {
  return [ rules.unsigned() ]
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
