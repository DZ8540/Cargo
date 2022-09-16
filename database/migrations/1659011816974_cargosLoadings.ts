import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.CARGOS_LOADINGS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('type').notNullable()
      table.boolean('isAllDay').notNullable()
      table.string('town').notNullable()
      table.string('address').notNullable()

      /**
       * * Nullable columns
       */

      table.date('date').nullable()
      table.integer('days').unsigned().nullable()
      table.integer('periodType').unsigned().nullable().comment(`
        Тип груз готов
        0 - по рабочим дням
        1 - по выходным
        2 - ежедневно
        3 - через день
      `)
      table.time('timeFrom').nullable()
      table.time('timeTo').nullable()
      table.boolean('transportationType').nullable().comment(`
        Тип перевозки
        0 - отдельной машиной
        1 - отдельной машиной или догрузом
      `)

      /**
       * * Foreign keys
       */

      table
        .integer('cargo_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.CARGOS}.id`)
        .onDelete('CASCADE')

      table
        .integer('cargoLoadingType_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.CARGOS_LOADINGS_TYPES}.id`)
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
