import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TemplateFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await TemplateFactory.createMany(20)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
