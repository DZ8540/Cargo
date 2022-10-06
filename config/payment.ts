// * Types
import type { PaymentConfig } from 'Contracts/payment'
// * Types

import Env from '@ioc:Adonis/Core/Env'

export const paymentConfig: PaymentConfig = {
  tinkoff: {
    apiUrl: Env.get('PAYMENT_TINKOFF_API_URL'),
    terminalKey: Env.get('PAYMENT_TINKOFF_TERMINAL_KEY'),
  },
}
