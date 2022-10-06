export type PaymentConfig = {
  tinkoff: {
    apiUrl: string,
    terminalKey: string,
  },
}

/**
 * * Tinkoff
 */

 type TinkoffDefaultReceipt = {
  Taxation: 'osn' | 'usn_income' | 'usn_income_outcome' | 'patent' | 'envd' | 'esn',
  Items: Array<{
    Name: string,

    Price: number,
    Amount: number,
    Quantity: number,

    Tax?: 'none' | 'vat0' | 'vat10' | 'vat20' | 'vat110' | 'vat120',
    PaymentMethod?: 'full_payment' | 'full_prepayment' | 'prepayment' | 'advance' | 'partial_payment' | 'credit' | 'credit_payment',
    PaymentObject?: 'commodity' | 'excise' | 'job' | 'service' | 'gambling_bet' | 'gambling_prize' | 'lottery' | 'lottery_prize' | 'intellectual_activity' | 'payment' | 'agent_commission' | 'composite' | 'another',
  }>,

  Payments?: {
    Electronic: number,

    Cash?: number,
    Credit?: number,
    Provision?: number,
    AdvancePayment?: number,
  },
}

type TinkoffReceiptWithPhone = { Phone: string } & TinkoffDefaultReceipt
type TinkoffReceiptWithEmail = { Email: string } & TinkoffDefaultReceipt
type TinkoffReceiptBoth = TinkoffReceiptWithEmail & TinkoffReceiptWithPhone

export type TinkoffWebHookPayload = {
  CardId: number,
  PaymentId: number,
  TerminalKey: string,
  OrderId: string,

  Token: string,
  Success: boolean,
  ErrorCode: string,
  Status: 'AUTHORIZED' | 'CONFIRMED' | 'REJECTED' | 'REFUNDED',

  Pan: string,
  Amount: number,
  ExpDate: string,
}

/**
 * * Tinkoff
 * - Init method
 */

export type TinkoffInitMethodPayload<R extends 'phone' | 'email' | 'both' | undefined = undefined> = {
  Amount: number,
  OrderId: string,
  TerminalKey: string,

  Recurrent?: 'Y',
  PayType?: 'O' | 'T',
  Description?: string,
  CustomerKey?: string,

  IP?: string,
  Token?: string,
  Language?: 'en' | 'ru',

  RedirectDueDate?: string,

  FailURL?: string,
  SuccessURL?: string,
  NotificationURL?: string,

  DATA?: object,
  Receipt?: R extends 'phone' ? TinkoffReceiptWithPhone : R extends 'email' ? TinkoffReceiptWithEmail : R extends 'both' ? TinkoffReceiptBoth : never,
}

export type TinkoffInitMethodResponse = {
  Success: boolean,
  ErrorCode: string,

  OrderId: string,
  PaymentId: string,

  Amount: number,
  TerminalKey: string,

  Status?: string,
  Message?: string,
  Details?: string,
  PaymentURL?: string,
}
