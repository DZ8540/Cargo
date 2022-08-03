// * Types
import type { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import {
  TEMPLATE_NAME_MAX_LENGTH, TEMPLATE_NAME_MIN_LENGTH,
  TEMPLATE_NOTE_MAX_LENGTH, TEMPLATE_NOTE_MIN_LENGTH
} from 'Config/database'

export function getTemplateNameRules(): Rule[] {
  return [
    rules.minLength(TEMPLATE_NAME_MIN_LENGTH),
    rules.maxLength(TEMPLATE_NAME_MAX_LENGTH),
  ]
}

export function getTemplateNoteRules(): Rule[] {
  return [
    rules.minLength(TEMPLATE_NOTE_MIN_LENGTH),
    rules.maxLength(TEMPLATE_NOTE_MAX_LENGTH),
  ]
}
