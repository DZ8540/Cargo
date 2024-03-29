import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    if (seeder.default.developmentOnly && !Application.inDev) return

    await new seeder.default(this.client).run()
  }

  public async run() {
    /**
     * * User
     */

    await this.runSeeder(await import('../User/Role'))
    await this.runSeeder(await import('../User/User'))

    /**
     * * Car
     */

    await this.runSeeder(await import('../Car/CarBodyType'))
    await this.runSeeder(await import('../Car/Car'))

    /**
     * * Other
     */

    await this.runSeeder(await import('../Template'))
    await this.runSeeder(await import('../News'))
    await this.runSeeder(await import('../Route'))
    await this.runSeeder(await import('../Topic'))

    /**
     * * Cargo
     * ! Don't change seeders in this section
     */

    await this.runSeeder(await import('../Cargo/Cargo'))
    await this.runSeeder(await import('../Cargo/CargoLoadingType'))
    await this.runSeeder(await import('../Cargo/CargoLoading'))
    await this.runSeeder(await import('../Cargo/CargoUnloading'))
    await this.runSeeder(await import('../Cargo/CargoItemPackageType'))
    await this.runSeeder(await import('../Cargo/CargoItemType'))
    await this.runSeeder(await import('../Cargo/CargoItem'))
  }
}
