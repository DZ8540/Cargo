import News from 'App/Models/News'
import Car from 'App/Models/Car/Car'
import User from 'App/Models/User/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CarBodyType from 'App/Models/Car/CarBodyType'
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

/**
 * * Car
 */

export const CarBodyTypeFactory = Factory
  .define(CarBodyType, ({ faker }) => {
    return { name: faker.unique(faker.vehicle.type) }
  })
  .relation('cars', () => CarFactory)
  .build()

export const CarFactory = Factory
  .define(Car, ({ faker }) => {
    return {
      name: faker.lorem.word(),
      additionalConfiguration: faker.datatype.number(2),
      carrying: faker.datatype.number(),
      capacity: faker.datatype.number(),
      width: faker.datatype.number(),
      height: faker.datatype.number(),
      length: faker.datatype.number(),
      sts: faker.unique(faker.vehicle.vin),
      vin: faker.unique(faker.vehicle.vin),
      pts: faker.unique(faker.vehicle.vrm),
      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()
