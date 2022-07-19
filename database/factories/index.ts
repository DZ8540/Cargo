import User from 'App/Models/User/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { ROLES_NAMES } from 'Config/shield'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    const roles = [...ROLES_NAMES] // For remove readonly
    roles.shift() // Remove admin role

    const randomRole = Math.floor(Math.random() * roles.length) + 1

    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      subject: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.unique(faker.phone.number),
      companyName: faker.unique(faker.company.companyName),
      taxIdentificationNumber: faker.unique(faker.datatype.number),
      city: faker.address.cityName(),
      avatar: faker.image.avatar(),
      roleId: randomRole,
    }
  })
  .build()
