// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { RoutesDatePeriodTypes } from 'Config/route'
import {
  ROUTE_NOTE_MAX_LENGTH, ROUTE_NOTE_MIN_LENGTH,
  ROUTE_ROUTE_MAX_LENGTH, ROUTE_ROUTE_MIN_LENGTH,
  TABLES_NAMES,
} from 'Config/database'

export function getRouteIdRules(table: string = TABLES_NAMES.ROUTES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getRouteFromRouteRules(): Rule[] {
  return [
    rules.minLength(ROUTE_ROUTE_MIN_LENGTH),
    rules.maxLength(ROUTE_ROUTE_MAX_LENGTH),
  ]
}

export function getRouteToRouteRules(): Rule[] {
  return getRouteFromRouteRules()
}

export function getRouteLoadingRadiusRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getRouteUnloadingRadiusRules(): Rule[] {
  return getRouteLoadingRadiusRules()
}

export function getRouteDateRules(): Rule[] {
  return [ rules.after('today') ]
}

export function getRouteDateDaysRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getRouteDatePeriodTypeRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(RoutesDatePeriodTypes.WEEKDAYS, RoutesDatePeriodTypes.IN_ONE_DAY),
  ]
}

export function getRoutePriceRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getRouteNoteRules(): Rule[] {
  return [
    rules.minLength(ROUTE_NOTE_MIN_LENGTH),
    rules.maxLength(ROUTE_NOTE_MAX_LENGTH),
  ]
}
