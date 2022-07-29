// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { CargosLoadingPeriodTypes } from 'Config/cargo'
import {
  CARGO_ADDRESS_MAX_LENGTH, CARGO_ADDRESS_MIN_LENGTH,
  CARGO_TOWN_MAX_LENGTH, CARGO_TOWN_MIN_LENGTH
} from 'Config/database'

export function getCargoLoadingTownRules(): Rule[] {
  return [
    rules.minLength(CARGO_TOWN_MIN_LENGTH),
    rules.maxLength(CARGO_TOWN_MAX_LENGTH),
  ]
}

export function getCargoLoadingAddressRules(): Rule[] {
  return [
    rules.minLength(CARGO_ADDRESS_MIN_LENGTH),
    rules.maxLength(CARGO_ADDRESS_MAX_LENGTH),
  ]
}

export function getCargoLoadingDateRules(): Rule[] {
  return [ rules.after('today') ]
}

export function getCargoLoadingDaysRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoLoadingPeriodTypeRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(CargosLoadingPeriodTypes.WEEKDAYS, CargosLoadingPeriodTypes.IN_ONE_DAY),
  ]
}
