// * Types
import type Route from 'App/Models/Route'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import RouteService from 'App/Services/RouteService'

export default class RoutesController {
  public async index({ view, session, request, route, response }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)

    try {
      const routes: ModelPaginatorContract<Route> = await RouteService.paginate({ page, baseUrl, relations: ['user'] })

      return view.render('pages/routes/index', { routes })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, session, params, response }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      const item: Route = await RouteService.get(id)

      return view.render('pages/routes/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  /**
   * * Archive
   */

  public async archive({ params, response, session }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      await RouteService.archiveAction(id, true)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unArchive({ params, response, session }: HttpContextContract) {
    const id: Route['id'] = params.id

    try {
      await RouteService.archiveAction(id, false)
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
