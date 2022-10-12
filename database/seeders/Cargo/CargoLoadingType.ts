// * Types
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CargoLoadingType from 'App/Models/Cargo/CargoLoadingType'
import { parse } from 'csv-parse/sync'

export default class extends BaseSeeder {
  public async run () {

    try {
      // await CargoLoadingTypeFactory
      //   .with('loadings', 2)
      //   .with('unLoadings', 2)
      //   .createMany(50)

      const types: Partial<ModelAttributes<CargoLoadingType>>[] = []
      const csvTypes: Buffer = fs.readFileSync(__dirname + '/../../../backups/cargoLoadingTypes.csv')
      const parsedTypes: string[][] = parse(csvTypes, { delimiter: ';' })
      parsedTypes.shift()

      // let i: number = 1
      for (const item of parsedTypes) {
        // Logger.info('Index:' + i)

        if (item[0])
          types.push({ name: item[0] })
        // i++
      }

      await CargoLoadingType.createMany(types)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
