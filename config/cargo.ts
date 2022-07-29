import { ROUTES_DATE_PERIOD_TYPES } from './route'

export const CARGOS_LOADING_PERIOD_TYPES = ROUTES_DATE_PERIOD_TYPES
export enum CargosLoadingPeriodTypes {
  WEEKDAYS = 0,
  EVERYDAY = 1,
  IN_ONE_DAY = 2,
}

export const CARGOS_ITEMS_NOTE_TYPES = ['Холод', 'Хрупкое', 'Габаритное'] as const
export enum CargosItemsNoteTypes {
  COLD = 0,
  FRAGILE = 1,
  OVERALL = 2,
}
