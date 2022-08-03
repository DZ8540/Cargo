import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ROUTE_NOTE_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.ROUTES

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isArchive').defaultTo(0).notNullable()
      table.string('fromRoute').notNullable()
      table.string('toRoute').notNullable()
      table.boolean('dateType').notNullable()
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
      table.integer('loadingRadius').unsigned().nullable()
      table.integer('unloadingRadius').unsigned().nullable()
      table.date('date').nullable()
      table.integer('dateDays').unsigned().nullable()
      table.integer('datePeriodType').unsigned().nullable().comment(`
        Тип единожды
        0 - по рабочим дням
        1 - ежедневно
        2 - через день
      `)
      table.integer('vatPrice').unsigned().nullable()
      table.integer('noVatPrice').unsigned().nullable()
      table.string('note', ROUTE_NOTE_MAX_LENGTH).nullable()

      /**
       * * Foreign keys
       */

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.USERS}.id`)
        .onDelete('CASCADE')

      table
        .integer('car_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.CARS}.id`)
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
