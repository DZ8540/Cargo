import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CargoLoadingTypeFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await CargoLoadingTypeFactory
        .with('loadings', 2)
        .with('unLoadings', 2)
        .createMany(50)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
