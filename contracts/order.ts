// * Types
import type { DurationLike } from 'luxon'
// * Types

export type TariffType = {
  name: string, // For banks product names
  price: number, // In rubles
  date: DurationLike,
}
