import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { StatusTypes } from 'Config/order'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.ORDERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.integer('statusType').unsigned().defaultTo(StatusTypes.IN_PROCESS).notNullable().comment(`
        0 - в процессе
        1 - успешный
        2 - отменен
      `)
      table.integer('tariffType').unsigned().notNullable().comment(`
        0 - 14 дней (500р)
        1 - 1 месяц (2000р)
        2 - 3 месяца (5500р)
        3 - 6 месяцев (10000р)
        4 - 12 месяцев (20000р)
      `)

      table.integer('price').unsigned().notNullable()

      /**
       * * Foreign keys
       */

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
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
