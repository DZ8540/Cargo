// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
// * Types

export default class IndexValidator {
  protected messages: CustomMessages = {
    unique: 'Значение уже занято!',
    required: 'должно быть заполненным!',
    email: 'должен быть в формате email!',
    minLength: 'должно содержать от {{ options.minLength }} символов!',
    maxLength: 'должно содержать максимум {{ options.maxLength }} символов!',
    mobile: 'должно быть в формате телефона!',
    exists: ' ', // None display message
    enum: 'Значение должно быть одним из: {{ options.choices }}!',
    number: 'Значение должно быть числом!',
    range: 'Значение должно быть от {{ options.start }} до {{ options.stop }}!',
    regex: ' ', // None display message
  }
}
