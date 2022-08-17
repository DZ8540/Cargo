export enum ResponseCodes {
  SUCCESS = 'SUCCESS',

  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  MAILER_ERROR = 'MAILER_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VERIFY_CODE_EXISTS = 'VERIFY_CODE_EXISTS',
}

export enum ResponseMessages {
  SUCCESS = 'Успешно!',
  ERROR = 'Что-то пошло не так, повторите попытку еще раз!',

  CARGO_ID_OR_ROUTE_ID_NOT_FOUND = 'Идентификационный номер маршрута или груза не найден!',

  CITY_UNDEFINED = 'Город пустой!',

  /**
   * * Auth
   */

  VALIDATION_ERROR = 'Заполните пожалуйста все поля правильно!',
  CODE_VERIFICATION_NOT_FOUND = 'Код верификации не найден!',
  TOKEN_ERROR = 'Токен верификации пользователя не найден или просрочен!',
  MISS_AUTH_HEADERS = 'Не найдены необходимые заголовки для авторизации!',
  CODE_VERIFICATION_ALREADY_EXISTS = 'Верификационный код уже был отправлен вам на почту!',
  NOT_ACCESS = 'Недостаточно прав для текущей роли!',

  /**
   * * User
   */

  USER_NOT_FOUND = 'Пользователь не найден!',
}

export const RESPONSES_STATUS_TYPES = ['На рассмотрении', 'Выполняется', 'Выполнен'] as const
export enum ResponsesStatusTypes {
  UNDER_CONSIDERATION = 0,
  IN_PROCESS = 1,
  COMPLETED = 2,
}
