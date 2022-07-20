// * Types
import type { Err } from 'Contracts/response'
import type { ResponseMessages } from 'Config/response'
// * Types

import { ResponseCodes } from 'Config/response'

type Response = Err & {
  status: number,
}

export default class ResponseService {
  constructor(message: ResponseMessages, body?: Response['body']) {
    return {
      body,
      message,
      status: 200,
      code: ResponseCodes.SUCCESS,
    } as Response
  }
}
