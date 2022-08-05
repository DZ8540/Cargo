import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { REPORT_CONTENT_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.REPORTS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Nullable columns
       */

      table.string('content', REPORT_CONTENT_MAX_LENGTH).nullable()

      /**
       * * Foreign keys
       */

      table
        .integer('from_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.USERS}.id`)
        .onDelete('CASCADE')

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

      table
        .integer('to_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.USERS}.id`)
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
