// * Types
import type { TariffType } from 'Contracts/order'
// * Types

/**
 * * Status type
 */

export const STATUS_TYPES = ['В процессе', 'Подтвержден', 'Отклонен', 'Возврат средств'] as const
export enum StatusTypes { // Don't rename keys
  IN_PROCESS = 0,
  CONFIRMED = 1,
  REJECTED = 2,
  REFUNDED = 3,
}

/**
 * * Tariff
 */

export const TARIFF_TYPES: TariffType[] = [
  {
    name: 'Пакет на 14 дней',
    date: { days: 14 },
    price: 500,
  },
  {
    name: 'Пакет на 1 месяц',
    date: { months: 1 },
    price: 2000,
  },
  {
    name: 'Пакет на 3 месяца',
    date: { months: 3 },
    price: 5500,
  },
  {
    name: 'Пакет на пол года',
    date: { months: 6 },
    price: 10000,
  },
  {
    name: 'Пакет на год',
    date: { years: 1 },
    price: 20000,
  },
]

export enum TariffTypes {
  HALF_MONTH = 0,
  MONTH = 1,
  THREE_MONTH = 2,
  HALF_YEAR = 3,
  YEAR = 4,
}
