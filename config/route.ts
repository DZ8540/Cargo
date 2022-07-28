export const ROUTES_DATE_PERIOD_TYPES = ['По рабочим дням', 'Ежедневно', 'Через день'] as const
export enum RoutesDatePeriodTypes {
  WEEKDAYS = 0,
  EVERYDAY = 1,
  IN_ONE_DAY = 2,
}
