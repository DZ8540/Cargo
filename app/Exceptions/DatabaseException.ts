import IndexException from './IndexException'
import { ResponseCodes } from 'Config/response'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new DatabaseException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class DatabaseException extends IndexException {
  status: number = 500
  code: ResponseCodes = ResponseCodes.DATABASE_ERROR
}
