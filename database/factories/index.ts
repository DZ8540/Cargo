import News from 'App/Models/News'
import User from 'App/Models/User/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { ROLES_NAMES } from 'Config/shield'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    const roles = [...ROLES_NAMES] // For remove readonly
    roles.shift() // Remove admin role

    const randomRole = Math.floor(Math.random() * roles.length) + 1

    return {
      roleId: randomRole,
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      city: faker.address.cityName(),
      lastName: faker.name.lastName(),
      subject: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      password: faker.internet.password(),
      phone: faker.unique(faker.phone.number),
      companyName: faker.unique(faker.company.companyName),
      taxIdentificationNumber: faker.unique(faker.datatype.number),
    }
  })
  .build()

export const NewsFactory = Factory
  .define(News, ({ faker }) => {
    return {
      image: faker.image.animals(),
      title: faker.unique(faker.vehicle.vehicle),
      description: faker.lorem.paragraphs(10),
    }
  })
  .build()
