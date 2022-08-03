// * Types
import type User from 'App/Models/User/User'
import type ApiValidator from 'App/Validators/ApiValidator'
import type TemplateValidator from 'App/Validators/Template/TemplateValidator'
import type RouteTemplateValidator from 'App/Validators/Template/RouteTemplateValidator'
import type CargoTemplateValidator from 'App/Validators/Template/CargoTemplateValidator'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
// * Types

import RouteService from './RouteService'
import Template from 'App/Models/Template'
import Logger from '@ioc:Adonis/Core/Logger'
import CargoService from './Cargo/CargoService'
import Database from '@ioc:Adonis/Lucid/Database'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class TemplateService {
  public static async paginateRoutesTemplates(userId: User['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Template>> {
    try {
      return await Template
        .query()
        .withScopes((scopes) => scopes.routesTemplates())
        .withScopes((scopes) => scopes.userTemplates(userId))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async paginateCargosTemplates(userId: User['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Template>> {
    try {
      return await Template
        .query()
        .withScopes((scopes) => scopes.cargosTemplates())
        .withScopes((scopes) => scopes.userTemplates(userId))
        .getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(id: Template['id']): Promise<Template> {
    let item: Template | null

    try {
      item = await Template.find(id)
    } catch (err: Err | any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async create(payload: RouteTemplateValidator['schema']['props'], actionFor: 'route'): Promise<Template>
  public static async create(payload: CargoTemplateValidator['schema']['props'], actionFor: 'cargo'): Promise<Template>
  public static async create(payload: RouteTemplateValidator['schema']['props'] | CargoTemplateValidator['schema']['props'], actionFor: 'route' | 'cargo'): Promise<Template> {
    let templateId: Template['id']
    const trx: TransactionClientContract = await Database.transaction()
    const templatePayload: TemplateValidator['schema']['props'] = {
      name: payload.templateName,
      note: payload.templateNote,
      userId: payload.userId,
    }

    try {
      templateId = (await Template.create(templatePayload, { client: trx })).id
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      const payloadWithoutTemplateProperties: Partial<(RouteTemplateValidator | CargoTemplateValidator)['schema']['props'] & { templateId: Template['id'] }> = { ...payload, templateId }
      delete payloadWithoutTemplateProperties.templateName
      delete payloadWithoutTemplateProperties.templateNote

      if (actionFor === 'route')
        await RouteService.create(payloadWithoutTemplateProperties as RouteTemplateValidator['schema']['props'], { trx })

      if (actionFor === 'cargo')
        await CargoService.create(payloadWithoutTemplateProperties as CargoTemplateValidator['schema']['props'], { trx })
    } catch (err: Err | any) {
      await trx.rollback()

      throw err
    }

    try {
      await trx.commit()

      return await this.get(templateId)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async update(id: Template['id'], payload: TemplateValidator['schema']['props']): Promise<Template> {
    let item: Template

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    try {
      return await this.get(id)
    } catch (err: Err | any) {
      throw err
    }
  }

  public static async delete(id: Template['id']): Promise<void> {
    let item: Template

    try {
      item = await this.get(id)
    } catch (err: Err | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
