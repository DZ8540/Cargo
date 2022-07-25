// * Types
import type Car from 'App/Models/Car/Car'
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { CarsAdditionalConfigurations } from 'Config/car'
import {
  CAR_NAME_MAX_LENGTH, CAR_NAME_MIN_LENGTH, CAR_PTS_MAX_LENGTH, CAR_PTS_MIN_LENGTH,
  CAR_STS_MAX_LENGTH, CAR_STS_MIN_LENGTH, CAR_VIN_MAX_LENGTH, CAR_VIN_MIN_LENGTH,
  TABLES_NAMES
} from 'Config/database'

export function getCarNameRules(): Rule[] {
  return [
    rules.minLength(CAR_NAME_MIN_LENGTH),
    rules.maxLength(CAR_NAME_MAX_LENGTH),
  ]
}

export function getCarAdditionalConfigurationRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(CarsAdditionalConfigurations.TRUCK, CarsAdditionalConfigurations.HITCH),
  ]
}

export function getCarCarryingRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCarCapacityRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCarWidthRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCarHeightRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCarLengthRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCarStsRules(withUniqueOrExists: 'unique' | false = false, currentId: Car['id'] | null = null, table: string = TABLES_NAMES.CARS): Rule[] {
  const rulesArr: Rule[] = [
    rules.minLength(CAR_STS_MIN_LENGTH),
    rules.maxLength(CAR_STS_MAX_LENGTH),
  ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'sts', whereNot: { id: currentId } }))

  return rulesArr
}

export function getCarVinRules(withUniqueOrExists: 'unique' | false = false, currentId: Car['id'] | null = null, table: string = TABLES_NAMES.CARS): Rule[] {
  const rulesArr: Rule[] = [
    rules.minLength(CAR_VIN_MIN_LENGTH),
    rules.maxLength(CAR_VIN_MAX_LENGTH),
  ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'vin', whereNot: { id: currentId } }))

  return rulesArr
}

export function getCarPtsRules(withUniqueOrExists: 'unique' | false = false, currentId: Car['id'] | null = null, table: string = TABLES_NAMES.CARS): Rule[] {
  const rulesArr: Rule[] = [
    rules.minLength(CAR_PTS_MIN_LENGTH),
    rules.maxLength(CAR_PTS_MAX_LENGTH),
  ]

  if (withUniqueOrExists == 'unique')
    rulesArr.push(rules.unique({ table, column: 'pts', whereNot: { id: currentId } }))

  return rulesArr
}
