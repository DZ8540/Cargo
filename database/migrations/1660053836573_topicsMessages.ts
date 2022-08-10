import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES, TOPIC_MESSAGES_DESCRIPTION_MAX_LENGTH } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.TOPICS_MESSAGES

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.string('description', TOPIC_MESSAGES_DESCRIPTION_MAX_LENGTH).notNullable()

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
        .integer('topic_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.TOPICS}.id`)
        .onDelete('CASCADE')

      table
        .integer('topicMessage_id')
        .unsigned()
        .nullable()
        .references(`${TABLES_NAMES.TOPICS_MESSAGES}.id`)
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
