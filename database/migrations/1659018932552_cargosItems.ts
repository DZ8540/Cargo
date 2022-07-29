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

      /**
       * * Nullable columns
       */

      table.integer('packageCount').unsigned().nullable()
      table.integer('length').unsigned().nullable()
      table.integer('width').unsigned().nullable()
      table.integer('height').unsigned().nullable()
      table.integer('noteType').unsigned().nullable().comment(`
        Особые отметки
        0 - холод
        1 - хрупкое
        2 - габаритное
      `)

      /**
       * * Foreign keys
       */

      table
        .integer('cargoItemType_id')
        .unsigned()
        .references(`${TABLES_NAMES.CARGOS_ITEMS_TYPES}.id`)
        .onDelete('CASCADE')

      table
        .integer('cargoItemPackageType_id')
        .unsigned()
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
