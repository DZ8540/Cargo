// * Types
import { Rule } from '@ioc:Adonis/Core/Validator'
// * Types

import { rules } from '@ioc:Adonis/Core/Validator'
import { REPORT_CONTENT_MAX_LENGTH, REPORT_CONTENT_MIN_LENGTH } from 'Config/database'

export function getReportContentRules(): Rule[] {
  return [
    rules.minLength(REPORT_CONTENT_MIN_LENGTH),
    rules.maxLength(REPORT_CONTENT_MAX_LENGTH),
  ]
}
