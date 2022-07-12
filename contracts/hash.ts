/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

// * Types
import type hashConfig from '../config/hash'
import type { InferListFromConfig } from '@adonisjs/core/build/config'
// * Types

declare module '@ioc:Adonis/Core/Hash' {
  interface HashersList extends InferListFromConfig<typeof hashConfig> {}
}
