// * Types
import type { DateTime } from 'luxon'
// * Types

import { camelCase } from 'Helpers/index'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class News extends BaseModel {
  public static readonly columns = [
    'id', 'slug', 'title',
    'description', 'image',
    'createdAt', 'updatedAt'
  ] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public image?: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * * Hooks
   */

  @beforeSave()
  public static async setSlug(news: News) {
    if (news.$dirty.slug)
      news.slug = camelCase(news.slug)

    if (!news.slug)
      news.slug = camelCase(news.title)
  }
}
