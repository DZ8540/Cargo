import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CargoFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await CargoFactory
        .with('contacts', 2)
        .with('loadings', 3)
        .with('unloadings', 3)
        .createMany(50)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
