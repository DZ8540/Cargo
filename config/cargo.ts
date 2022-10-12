import { ROUTES_DATE_PERIOD_TYPES } from './route'

export const CARGOS_BARGAIN_TYPES = ['Возможен торг', 'Без торга'] as const
export enum CargosBargainTypes {
  POSSIBLE = 0,
  WITHOUT = 1,
}

export const CARGOS_CALCULATE_TYPES = ['Наличный расчет', 'Перевод по карте'] as const
export enum CargosCalculateTypes {
  CASH = 0,
  CARD = 1,
}

/**
 * * Cargo loading
 */

export const CARGOS_LOADING_TYPE_TYPES = ['Груз готов', 'Постоянно']
export enum CargosLoadingTypeTypes {
  READY = 0,
  ALWAYS = 1,
}

export const CARGOS_LOADING_PERIOD_TYPES = ROUTES_DATE_PERIOD_TYPES
export enum CargosLoadingPeriodTypes {
  WEEKDAYS = 0,
  WEEKENDS = 1,
  EVERYDAY = 2,
  IN_ONE_DAY = 3,
}

export const CARGOS_LOADING_TRANSPORTATION_TYPES = ['Отдельной машиной', 'Отдельной машиной или догрузом']
export enum CargosLoadingTransportationTypes {
  CAR = 0,
  UNTIL_CAR = 1,
}

/**
 * * Cargo item
 */

export const CARGOS_ITEMS_NOTE_TYPES = ['Режим', 'Хрупкое', 'Негабаритные'] as const
export enum CargosItemsNoteTypes {
  MODE = 0,
  FRAGILE = 1,
  NO_OVERALL = 2,
}
