// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { TABLES_NAMES } from 'Config/database'
import { rules } from '@ioc:Adonis/Core/Validator'
import { CargosItemsNoteTypes } from 'Config/cargo'

export function getCargoItemTypeIdRules(table: string = TABLES_NAMES.CARGOS_ITEMS_TYPES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getCargoItemPackageTypeIdRules(table: string = TABLES_NAMES.CARGOS_ITEMS_PACKAGE_TYPES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getCargoItemWeightRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemCapacityRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemWidthRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemHeightRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemLengthRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemPackageCountRules(): Rule[] {
  return [ rules.unsigned() ]
}

export function getCargoItemNoteTypesRules(): Rule[] {
  return [
    rules.unsigned(),
    rules.range(CargosItemsNoteTypes.COLD, CargosItemsNoteTypes.OVERALL),
  ]
}
