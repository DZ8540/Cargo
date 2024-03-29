import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { NEWS_DESCRIPTION_MAX_LENGTH, TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.NEWS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('slug').unique().notNullable()
      table.string('title').notNullable()
      table.string('description', NEWS_DESCRIPTION_MAX_LENGTH).notNullable()

      /**
       * * Nullable columns
       */

      table.string('image').nullable()

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
