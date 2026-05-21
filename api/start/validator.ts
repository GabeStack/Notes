/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { VineDate, SimpleMessagesProvider  } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'O título é obrigatório.',
  'title.maxLength': 'O título deve ter no máximo 100 caracteres.',
  'description.required': 'A descrição é obrigatória.',
  'favorite.boolean': 'O campo favorito deve ser verdadeiro ou falso.',
  'color.enum': 'A cor informada não é válida.',
})

VineDate.transform((value) => DateTime.fromJSDate(value))