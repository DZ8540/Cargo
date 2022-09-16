import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.CARGOS_ITEMS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.integer('weight').unsigned().notNullable()
      table.integer('capacity').unsigned().notNullable()
      table.boolean('adr1').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr2').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr3').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr4').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr5').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr6').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr7').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr8').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('adr9').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('tir').defaultTo(0).notNullable().comment('Разрешения груза')
      table.boolean('ekmt').defaultTo(0).notNullable().comment('Разрешения груза')

      /**
       * * Nullable columns
       */

      table.integer('packageCount').unsigned().nullable()
      table.integer('length').unsigned().nullable()
      table.integer('width').unsigned().nullable()
      table.integer('height').unsigned().nullable()
      table.integer('noteType').unsigned().nullable().comment(`
        Особые отметки
        0 - режим
        1 - хрупкое
        2 - негабаритные
      `)

      /**
       * * Foreign keys
       */

      table
        .integer('cargoItemType_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.CARGOS_ITEMS_TYPES}.id`)
        .onDelete('CASCADE')

      table
        .integer('cargoItemPackageType_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.CARGOS_ITEMS_PACKAGE_TYPES}.id`)
        .onDelete('CASCADE')

      table
        .integer('cargo_id')
        .unsigned()
        .notNullable()
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
