import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CARGO_NOTE_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.CARGOS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isArchive').defaultTo(0).notNullable()
      table.integer('prepayment').unsigned().notNullable().comment('В процентах от 0 до 100')

      /**
       * * Nullable columns
       */

      table.boolean('bargainType').nullable().comment(`
        0 - Возможен торг
        1 - Без торга
      `)
      table.boolean('calculateType').nullable().comment(`
        0 - Наличный расчет
        1 - Перевод по карте
      `)
      table.integer('fromTemperature').unsigned().nullable()
      table.integer('toTemperature').unsigned().nullable()
      table.integer('vatPrice').unsigned().nullable()
      table.integer('noVatPrice').unsigned().nullable()
      table.string('note', CARGO_NOTE_MAX_LENGTH).nullable()

      /**
       * * Not nullable columns
       */

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.USERS}.id`)
        .onDelete('CASCADE')

      table
        .integer('carBodyType_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.CAR_BODY_TYPES}.id`)
        .onDelete('CASCADE')

      table
        .integer('template_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.TEMPLATES}.id`)
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
