// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import {
  TABLES_NAMES,
  TOPIC_MESSAGES_DESCRIPTION_MAX_LENGTH,
  TOPIC_MESSAGES_DESCRIPTION_MIN_LENGTH,
} from 'Config/database'

export function getTopicMessageIdRules(table: string = TABLES_NAMES.TOPICS_MESSAGES): Rule[] {
  return [
    rules.unsigned(),
    rules.exists({ table, column: 'id' })
  ]
}

export function getTopicMessageDescriptionRules(): Rule[] {
  return [
    rules.minLength(TOPIC_MESSAGES_DESCRIPTION_MIN_LENGTH),
    rules.maxLength(TOPIC_MESSAGES_DESCRIPTION_MAX_LENGTH),
  ]
}
