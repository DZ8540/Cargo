import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.CARS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('name').notNullable()
      table.integer('additionalConfiguration').unsigned().notNullable().comment(`
        0 - грузовик
        1 - полуприцеп
        2 - сцепка
      `)
      table.integer('carrying').unsigned().notNullable()
      table.integer('capacity').unsigned().notNullable()
      table.integer('width').unsigned().notNullable()
      table.integer('height').unsigned().notNullable()
      table.integer('length').unsigned().notNullable()

      /**
       * * Nullable columns
       */

      table.string('sts').unique().nullable().comment('СТС')
      table.string('vin').unique().nullable().comment('VIN код')
      table.string('pts').unique().nullable().comment('ПТС')

      /**
       * * Foreign keys
       */

      table
        .integer('carBodyType_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.CAR_BODY_TYPES}.id`)
        .onDelete('CASCADE')

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
