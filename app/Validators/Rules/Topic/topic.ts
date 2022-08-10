// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import {
  TABLES_NAMES, TOPIC_DESCRIPTION_MAX_LENGTH,
  TOPIC_DESCRIPTION_MIN_LENGTH, TOPIC_TITLE_MAX_LENGTH,
  TOPIC_TITLE_MIN_LENGTH
} from 'Config/database'

export function getTopicIdRules(table: string = TABLES_NAMES.TOPICS): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getTopicTitleRules(): Rule[] {
  return [
    rules.minLength(TOPIC_TITLE_MIN_LENGTH),
    rules.maxLength(TOPIC_TITLE_MAX_LENGTH),
  ]
}

export function getTopicDescriptionRules(): Rule[] {
  return [
    rules.minLength(TOPIC_DESCRIPTION_MIN_LENGTH),
    rules.maxLength(TOPIC_DESCRIPTION_MAX_LENGTH),
  ]
}
