import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CargoItemPackageTypeFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await CargoItemPackageTypeFactory.createMany(20)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
