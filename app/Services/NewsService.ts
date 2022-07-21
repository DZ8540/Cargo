// * Types
import type { Err } from 'Contracts/response'
import type { PaginateConfig } from 'Contracts/services'
import type { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
// * Types

import News from 'App/Models/News'
import Logger from '@ioc:Adonis/Core/Logger'
import { ResponseCodes, ResponseMessages } from 'Config/response'

export default class NewsService {
  public static async paginate(config: PaginateConfig<News>): Promise<ModelPaginatorContract<News>> {
    try {
      return await News.query().getViaPaginate(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }

  public static async get(slug: News['slug']): Promise<News> {
    let item: News | null

    try {
      item = await News.findBy('slug', slug)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Err

    return item
  }

  public static async random(limit: number): Promise<News[]> {
    try {
      let news: News[] = []

      for (let i = 0; i < limit; ) {
        let item: News = await News.query().random()

        // For remove double items
        if (!(news.find((val) => val.id == item.id))) {
          news.push(item)
          i++
        }
      }

      return news
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Err
    }
  }
}
