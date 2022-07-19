import User from 'App/Models/User/User'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { RolesNames } from 'Config/shield'
import { UserFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {

    try {
      await User.createMany([
        {
          email: 'admin@mail.ru',
          password: '1234Admin',
          subject: false,
          firstName: 'Admin',
          lastName: 'Admin',
          phone: '+79050218620',
          city: 'Kazan',
          roleId: RolesNames.ADMIN + 1,
        },
        {
          email: 'test@mail.ru',
          password: '1234Test',
          subject: true,
          firstName: 'Test',
          lastName: 'Test',
          phone: '+79050218621',
          city: 'Kazan',
          roleId: RolesNames.CARGO_OWNER + 1,
        },
      ])

      await UserFactory.createMany(20)
    } catch (err: any) {
      Logger.error(err)
    }

  }
}
