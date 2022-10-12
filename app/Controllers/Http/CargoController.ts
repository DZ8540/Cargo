// * Types
import type Cargo from 'App/Models/Cargo/Cargo'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import CargoService from 'App/Services/Cargo/CargoService'

export default class CargoController {
  public async index({ view, session, request, route, response }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const cargo: ModelPaginatorContract<Cargo> = await CargoService.paginate({ page, baseUrl, relations: ['user'] })

      return view.render('pages/cargo/index', { cargo })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, session, params, response }: HttpContextContract) {
    const id: Cargo['id'] = params.id

    try {
      const item: Cargo = await CargoService.get(id)

      return view.render('pages/cargo/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  /**
   * * Archive
   */

  public async archive({ params, response, session }: HttpContextContract) {
    const id: Cargo['id'] = params.id

    try {
      await CargoService.archiveAction(id, true)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unArchive({ params, response, session }: HttpContextContract) {
    const id: Cargo['id'] = params.id

    try {
      await CargoService.archiveAction(id, false)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
