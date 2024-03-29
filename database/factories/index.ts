import News from 'App/Models/News'
import Car from 'App/Models/Car/Car'
import Route from 'App/Models/Route'
import Report from 'App/Models/Report'
import User from 'App/Models/User/User'
import Cargo from 'App/Models/Cargo/Cargo'
import Template from 'App/Models/Template'
import Response from 'App/Models/Response'
import Topic from 'App/Models/Topic/Topic'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CargoItem from 'App/Models/Cargo/CargoItem'
import CarBodyType from 'App/Models/Car/CarBodyType'
import CargoLoading from 'App/Models/Cargo/CargoLoading'
import TopicMessage from 'App/Models/Topic/TopicMessage'
import CargoItemType from 'App/Models/Cargo/CargoItemType'
import CargoUnloading from 'App/Models/Cargo/CargoUnloading'
import RouteOrCargoContact from 'App/Models/RouteOrCargoContact'
import CargoLoadingType from 'App/Models/Cargo/CargoLoadingType'
import CargoItemPackageType from 'App/Models/Cargo/CargoItemPackageType'
import { DateTime } from 'luxon'
import { ROLES_NAMES } from 'Config/shield'
import { RoutesDatePeriodTypes } from 'Config/route'
import { ResponsesStatusTypes } from 'Config/response'
import { CargosLoadingPeriodTypes, CargosItemsNoteTypes } from 'Config/cargo'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    const roles = [...ROLES_NAMES] // For remove readonly
    roles.shift() // Remove admin role

    const randomRole = Math.floor(Math.random() * roles.length) + 1

    return {
      email: faker.internet.email(),
      subject: faker.datatype.boolean(),
      password: faker.internet.password(),

      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      phone: faker.unique(faker.phone.number),
      city: faker.address.cityName(),

      companyName: faker.unique(faker.company.companyName),
      taxIdentificationNumber: faker.unique(faker.datatype.number),

      roleId: randomRole,
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

export const TemplateFactory = Factory
  .define(Template, ({ faker }) => {
    return {
      name: faker.random.word(),
      note: faker.lorem.sentence(),

      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()

export const RouteFactory = Factory
  .define(Route, ({ faker }) => {
    return {
      vatPrice: faker.datatype.number(),
      noVatPrice: faker.datatype.number(),
      prepayment: faker.datatype.number(),

      fromRoute: faker.address.cityName(),
      toRoute: faker.address.cityName(),

      date: DateTime.fromJSDate(faker.date.future()),
      dateDays: faker.datatype.number(),
      dateType: faker.datatype.boolean(),

      bargainType: faker.datatype.boolean(),
      calculateType: faker.datatype.boolean(),
      datePeriodType: faker.datatype.number({
        min: RoutesDatePeriodTypes.WEEKDAYS,
        max: RoutesDatePeriodTypes.IN_ONE_DAY,
      }),

      loadingRadius: faker.datatype.number(),
      unloadingRadius: faker.datatype.number(),

      note: faker.random.words(10),

      carId: faker.datatype.number({ min: 1, max: 10 }),
      userId: faker.datatype.number({ min: 1, max: 20 }),
      templateId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .relation('reports', () => ReportFactory)
  .relation('responses', () => ResponseFactory)
  .relation('contacts', () => RouteOrCargoContactFactory)
  .build()

export const RouteOrCargoContactFactory = Factory
  .define(RouteOrCargoContact, ({ faker }) => {
    return {
      phone: faker.phone.number(),
      firstName: faker.name.firstName(),
    }
  })
  .build()

export const ReportFactory = Factory
  .define(Report, ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
      fromId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()

export const ResponseFactory = Factory
  .define(Response, ({ faker }) => {
    return {
      status: faker.datatype.number({
        min: ResponsesStatusTypes.UNDER_CONSIDERATION,
        max: ResponsesStatusTypes.COMPLETED,
      }),
      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()

/**
 * * Topic
 */

export const TopicFactory = Factory
  .define(Topic, ({ faker }) => {
    return {
      title: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .relation('messages', () => TopicMessageFactory)
  .build()

export const TopicMessageFactory = Factory
  .define(TopicMessage, ({ faker }) => {
    return {
      description: faker.lorem.paragraph(),
      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()

/**
 * * Cargo
 */

export const CargoFactory = Factory
  .define(Cargo, ({ faker }) => {
    return {
      bargainType: faker.datatype.boolean(),
      calculateType: faker.datatype.boolean(),

      toTemperature: faker.datatype.number(),
      fromTemperature: faker.datatype.number(),

      vatPrice: faker.datatype.number(),
      noVatPrice: faker.datatype.number(),
      prepayment: faker.datatype.number(),

      note: faker.random.words(10),

      userId: faker.datatype.number({ min: 1, max: 20 }),
      templateId: faker.datatype.number({ min: 1, max: 20 }),
      carBodyTypeId: faker.datatype.number({ min: 1, max: 10 }),
    }
  })
  .relation('reports', () => ReportFactory)
  .relation('loadings', () => CargoLoadingFactory)
  .relation('unloadings', () => CargoUnloadingFactory)
  .relation('contacts', () => RouteOrCargoContactFactory)
  .relation('responses', () => ResponseFactory)
  .build()

export const CargoLoadingTypeFactory = Factory
  .define(CargoLoadingType, ({ faker }) => {
    return { name: faker.unique(faker.random.word) }
  })
  .relation('loadings', () => CargoLoadingFactory)
  .relation('unLoadings', () => CargoUnloadingFactory)
  .build()

export const CargoLoadingFactory = Factory
  .define(CargoLoading, ({ faker }) => {
    return {
      type: faker.datatype.boolean(),
      isAllDay: faker.datatype.boolean(),

      town: faker.address.cityName(),
      address: faker.address.streetAddress(true),

      date: DateTime.fromJSDate(faker.date.future()),
      days: faker.datatype.number(),
      timeFrom: DateTime.now().toFormat('HH:mm'),
      timeTo: DateTime.now().plus({ days: 10 }).toFormat('HH:mm'),
      periodType: faker.datatype.number({
        min: CargosLoadingPeriodTypes.WEEKDAYS,
        max: CargosLoadingPeriodTypes.IN_ONE_DAY,
      }),
      transportationType: faker.datatype.boolean(),

      cargoId: faker.datatype.number({ min: 1, max: 50 }),
      cargoLoadingTypeId: faker.datatype.number({ min: 1, max: 10 }),
    }
  })
  .build()

export const CargoUnloadingFactory = Factory
  .define(CargoUnloading, ({ faker }) => {
    return {
      isAllDay: faker.datatype.boolean(),
      town: faker.address.cityName(),
      address: faker.address.streetAddress(true),

      dateFrom: DateTime.fromJSDate(faker.date.future()),
      dateTo: DateTime.fromJSDate(faker.date.future()),
      timeFrom: DateTime.now().toFormat('HH:mm'),
      timeTo: DateTime.now().plus({ days: 10 }).toFormat('HH:mm'),

      cargoId: faker.datatype.number({ min: 1, max: 50 }),
      cargoLoadingTypeId: faker.datatype.number({ min: 1, max: 10 }),
    }
  })
  .build()

export const CargoItemTypeFactory = Factory
  .define(CargoItemType, ({ faker }) => {
    return { name: faker.unique(faker.random.word) }
  })
  .relation('cargoItem', () => CargoItemFactory)
  .build()

export const CargoItemPackageTypeFactory = Factory
  .define(CargoItemPackageType, ({ faker }) => {
    return { name: faker.unique(faker.random.word) }
  })
  .build()

export const CargoItemFactory = Factory
  .define(CargoItem, ({ faker }) => {
    return {
      adr1: faker.datatype.boolean(),
      adr2: faker.datatype.boolean(),
      adr3: faker.datatype.boolean(),
      adr4: faker.datatype.boolean(),
      adr5: faker.datatype.boolean(),
      adr6: faker.datatype.boolean(),
      adr7: faker.datatype.boolean(),
      adr8: faker.datatype.boolean(),
      adr9: faker.datatype.boolean(),
      tir: faker.datatype.boolean(),
      ekmt: faker.datatype.boolean(),

      weight: faker.datatype.number(),
      capacity: faker.datatype.number(),
      width: faker.datatype.number(),
      height: faker.datatype.number(),
      length: faker.datatype.number(),

      packageCount: faker.datatype.number(10),

      noteType: faker.datatype.number({
        min: CargosItemsNoteTypes.MODE,
        max: CargosItemsNoteTypes.NO_OVERALL,
      }),

      cargoId: faker.datatype.number({ min: 1, max: 20 }),
      cargoItemTypeId: faker.datatype.number({ min: 1, max: 20 }),
      cargoItemPackageTypeId: faker.datatype.number({ min: 1, max: 10 }),
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
  .define(Car, async ({ faker }) => {
    return {
      name: faker.lorem.word(),

      width: faker.datatype.number(),
      height: faker.datatype.number(),
      length: faker.datatype.number(),

      carrying: faker.datatype.number(),
      capacity: faker.datatype.number(),
      additionalConfiguration: faker.datatype.number(2),

      sts: faker.unique(faker.vehicle.vin),
      vin: faker.unique(faker.vehicle.vin),
      pts: faker.unique(faker.vehicle.vrm),

      userId: faker.datatype.number({ min: 1, max: 20 }),
      carBodyTypeId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()
