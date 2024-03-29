// * Types
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CargoItemType from 'App/Models/Cargo/CargoItemType'
import { parse } from 'csv-parse/sync'

export default class extends BaseSeeder {
  public async run () {

    try {
      // await CargoItemTypeFactory.with('cargoItem', 5).createMany(20)

      const types: Partial<ModelAttributes<CargoItemType>>[] = []
      const csvTypes: Buffer = fs.readFileSync(__dirname + '/../../../backups/cargoItemTypes.csv')
      const parsedTypes: string[][] = parse(csvTypes)

      // let i: number = 1
      for (const item of parsedTypes) {
        // Logger.info('Index:' + i)

        if (item[0])
          types.push({ name: item[0] })
        // i++
      }

      await CargoItemType.createMany(types)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
