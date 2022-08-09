export const ROUTES_DATE_PERIOD_TYPES = ['По рабочим дням', 'По выходным', 'Ежедневно', 'Через день'] as const
export enum RoutesDatePeriodTypes {
  WEEKDAYS = 0,
  WEEKENDS = 1,
  EVERYDAY = 2,
  IN_ONE_DAY = 3,
}
