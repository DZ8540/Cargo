// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import {
  CARGO_ADDRESS_MAX_LENGTH, CARGO_ADDRESS_MIN_LENGTH,
  CARGO_TOWN_MAX_LENGTH, CARGO_TOWN_MIN_LENGTH
} from 'Config/database'

export function getCargoUnloadingTownRules(): Rule[] {
  return [
    rules.minLength(CARGO_TOWN_MIN_LENGTH),
    rules.maxLength(CARGO_TOWN_MAX_LENGTH),
  ]
}

export function getCargoUnloadingAddressRules(): Rule[] {
  return [
    rules.minLength(CARGO_ADDRESS_MIN_LENGTH),
    rules.maxLength(CARGO_ADDRESS_MAX_LENGTH),
  ]
}

export function getCargoUnloadingDateFromRules(): Rule[] {
  return [ rules.after('today') ]
}

export function getCargoUnloadingDateToRules(): Rule[] {
  return [ rules.after('today') ]
}
