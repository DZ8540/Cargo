// * Types
import type Car from 'App/Models/Car/Car'
import type { Err } from 'Contracts/response'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import CarService from 'App/Services/Car/CarService'

export default class CarsController {
  public async index({ view, session, request, route, response }: HttpContextContract) {
    const baseUrl: string = route!.pattern
    const page: number = request.input('page', 1)
    const columns: typeof Car.columns[number][] = [
      'id', 'isVerified', 'name', 'carrying',
      'capacity', 'length', 'width', 'height',
      'carBodyTypeId',
    ]

    try {
      const cars: ModelPaginatorContract<Car> = await CarService.paginate({ page, baseUrl }, columns)

      return view.render('pages/cars/index', { cars })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async show({ view, session, params, response }: HttpContextContract) {
    const id: Car['id'] = params.id

    try {
      const item: Car = await CarService.get(id)

      return view.render('pages/cars/show', { item })
    } catch (err: Err | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  /**
   * * Verify
   */

  public async verify({ params, response, session }: HttpContextContract) {
    const id: Car['id'] = params.id

    try {
      await CarService.verifyAction(id, 'verify')
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unVerify({ params, response, session }: HttpContextContract) {
    const id: Car['id'] = params.id

    try {
      await CarService.verifyAction(id, 'unVerify')
    } catch (err: Err | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
