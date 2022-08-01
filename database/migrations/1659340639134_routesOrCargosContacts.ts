import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.ROUTES_OR_CARGOS_CONTACTS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('phone').notNullable()
      table.string('firstName').notNullable()

      /**
       * * Foreign keys
       */

      table
        .integer('route_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.ROUTES}.id`)
        .onDelete('CASCADE')

      table
        .integer('cargo_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.CARGOS}.id`)
        .onDelete('CASCADE')

      /**
       * * Timestamps
       */

      table.timestamp('createdAt', { useTz: true }).notNullable()
      table.timestamp('updatedAt', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
