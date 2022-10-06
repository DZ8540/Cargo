/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

export const TABLES_NAMES = {
  NEWS: 'news',
  ROUTES: 'routes',
  ROUTES_OR_CARGOS_CONTACTS: 'routesOrCargosContacts',
  TEMPLATES: 'templates',
  REPORTS: 'reports',
  RESPONSES: 'responses',
  QUESTIONS: 'questions',
  ORDERS: 'orders',

  /**
   * * Topic
   */

  TOPICS: 'topics',
  TOPICS_LIKES: 'topicsLikes',

  TOPICS_MESSAGES: 'topicsMessages',
  TOPICS_MESSAGES_LIKES: 'topicsMessagesLikes',

  /**
   * * Cargo
   */

  CARGOS: 'cargos',

  CARGOS_LOADINGS: 'cargosLoadings',
  CARGOS_LOADINGS_TYPES: 'cargosLoadingsTypes',

  CARGOS_UNLOADINGS: 'cargosUnloadings',

  CARGOS_ITEMS: 'cargosItems',
  CARGOS_ITEMS_TYPES: 'cargosItemsTypes',
  CARGOS_ITEMS_PACKAGE_TYPES: 'cargosItemsPackageTypes',

  /**
   * * Car
   */

  CARS: 'cars',
  CAR_BODY_TYPES: 'carBodyTypes',

  /**
   * * User
   */

  ROLES: 'roles',
  USERS: 'users',
  SESSIONS: 'sessions',
} as const

export const NEWS_DESCRIPTION_MIN_LENGTH: number = 5
export const NEWS_DESCRIPTION_MAX_LENGTH: number = 8192

/**
 * * Question
 */

export const QUESTION_DESCRIPTION_MIN_LENGTH: number = 5
export const QUESTION_DESCRIPTION_MAX_LENGTH: number = 1024

/**
 * * Topic
 */

export const TOPIC_TITLE_MIN_LENGTH: number = 2
export const TOPIC_TITLE_MAX_LENGTH: number = 50

export const TOPIC_DESCRIPTION_MIN_LENGTH: number = 2
export const TOPIC_DESCRIPTION_MAX_LENGTH: number = 4096

export const TOPIC_MESSAGES_DESCRIPTION_MIN_LENGTH: number = 1
export const TOPIC_MESSAGES_DESCRIPTION_MAX_LENGTH: number = 2048

/**
 * * Report
 */

export const REPORT_CONTENT_MIN_LENGTH: number = 5
export const REPORT_CONTENT_MAX_LENGTH: number = 1024

/**
 * * Template
 */

export const TEMPLATE_NAME_MIN_LENGTH: number = 2
export const TEMPLATE_NAME_MAX_LENGTH: number = 50

export const TEMPLATE_NOTE_MIN_LENGTH = 2
export const TEMPLATE_NOTE_MAX_LENGTH = 250

/**
 * * Route
 */

export const ROUTE_ROUTE_MIN_LENGTH: number = 2
export const ROUTE_ROUTE_MAX_LENGTH: number = 50

export const ROUTE_NOTE_MIN_LENGTH = 2
export const ROUTE_NOTE_MAX_LENGTH = 512

/**
 * * Cargo
 */

export const CARGO_TOWN_MIN_LENGTH: number = 2
export const CARGO_TOWN_MAX_LENGTH: number = 50

export const CARGO_ADDRESS_MIN_LENGTH: number = 2
export const CARGO_ADDRESS_MAX_LENGTH: number = 100

export const CARGO_NOTE_MIN_LENGTH = 2
export const CARGO_NOTE_MAX_LENGTH = 512

/**
 * * Car
 */

export const CAR_NAME_MIN_LENGTH: number = 2
export const CAR_NAME_MAX_LENGTH: number = 50
export const CAR_STS_MIN_LENGTH: number = 2
export const CAR_STS_MAX_LENGTH: number = 50
export const CAR_VIN_MIN_LENGTH: number = 2
export const CAR_VIN_MAX_LENGTH: number = 50
export const CAR_PTS_MIN_LENGTH: number = 2
export const CAR_PTS_MAX_LENGTH: number = 50

/**
 * * User
 */

export const USER_FULL_NAME_MIN_USERS_LENGTH: number = 2
export const USER_FULL_NAME_MAX_USERS_LENGTH: number = 20
export const USER_PASSWORD_MIN_USERS_LENGTH: number = 8
export const USER_PASSWORD_MAX_USERS_LENGTH: number = 50

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      debug: false,
      healthCheck: false,
      migrations: {
        naturalSort: true,
      },
      seeders: {
        paths: ['./database/seeders/MainSeeder']
      },
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
    },

  }
}

export default databaseConfig
