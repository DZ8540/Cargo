import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TABLES_NAMES } from 'Config/database'

export default class extends BaseSchema {
  protected tableName = TABLES_NAMES.USERS

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * * Not nullable columns
       */

      table.boolean('isBlocked').defaultTo(0).notNullable().comment(`
        0 - не заблокирован
        1 - заблокирован
      `)
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.boolean('subject').defaultTo(0).notNullable().comment(`
        Тип лица
        0 - физ лицо
        1 - юр лицо
      `)

      /**
       * * Nullable columns
       */

      table.string('firstName').nullable()
      table.string('lastName').nullable()
      table.string('phone').unique().nullable()
      table.string('companyName').unique().nullable()
      table.integer('taxIdentificationNumber').unique().unsigned().nullable().comment('ИНН')
      table.string('city').nullable()
      table.string('avatar').nullable()

      /**
       * * Foreign keys
       */

      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references(`${TABLES_NAMES.ROLES}.id`)
        .onDelete('CASCADE')

      /**
       * * Timestamps
       */

      table.timestamp('createdAt', { useTz: true }).notNullable()
      table.timestamp('updatedAt', { useTz: true }).notNullable()

      table.timestamp('tariffExpiredAt', { useTz: true }).nullable().comment('Дата конца купленного тарифа. Если отсутствует, то еще не покупал тариф')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
