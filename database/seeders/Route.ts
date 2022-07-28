import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RouteFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await RouteFactory.createMany(50)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
