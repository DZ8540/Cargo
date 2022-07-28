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
     * * Other
     */

    await this.runSeeder(await import('../News'))

    await this.runSeeder(await import('../CarBodyType'))
    await this.runSeeder(await import('../Route'))
  }
}
