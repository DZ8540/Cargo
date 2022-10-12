// * Types
import type { ModelAttributes } from '@ioc:Adonis/Lucid/Orm'
// * Types

import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CargoItemPackageType from 'App/Models/Cargo/CargoItemPackageType'
import { parse } from 'csv-parse/sync'

export default class extends BaseSeeder {
  public async run () {

    try {
      // await CargoItemPackageTypeFactory.createMany(20)

      const types: Partial<ModelAttributes<CargoItemPackageType>>[] = []
      const csvTypes: Buffer = fs.readFileSync(__dirname + '/../../../backups/cargoItemPackageTypes.csv')
      const parsedTypes: string[][] = parse(csvTypes, { delimiter: '\t' })
      parsedTypes.shift()

      // let i: number = 1
      for (const item of parsedTypes) {
        // Logger.info('Index:' + i)

        if (item[0])
          types.push({ name: item[0] })
        // i++
      }

      await CargoItemPackageType.createMany(types)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
