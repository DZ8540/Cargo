export const ROUTES_DATE_PERIOD_TYPES = ['По рабочим дням', 'По выходным', 'Ежедневно', 'Через день'] as const
export enum RoutesDatePeriodTypes {
  WEEKDAYS = 0,
  WEEKENDS = 1,
  EVERYDAY = 2,
  IN_ONE_DAY = 3,
}

export const ROUTES_BARGAIN_TYPES = ['Возможен торг', 'Без торга'] as const
export enum RoutesBargainTypes {
  POSSIBLE = 0,
  WITHOUT = 1,
}

export const ROUTES_CALCULATE_TYPES = ['Наличный расчет', 'Перевод по карте'] as const
export enum RoutesCalculateTypes {
  CASH = 0,
  CARD = 1,
}

export const ROUTES_LOADING_TYPE_TYPES = ['Груз готов', 'Постоянно']
export enum RoutesLoadingTypeTypes {
  READY = 0,
  ALWAYS = 1,
}
