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

/**
 * * Route
 */

export const ROUTE_ROUTE_MIN_LENGTH: number = 2
export const ROUTE_ROUTE_MAX_LENGTH: number = 50

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
