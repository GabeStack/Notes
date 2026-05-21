import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const allowedColors = ['red', 'green', 'blue', 'yellow'] as const

export const createNoteValidator = vine.create({
    title: vine.string().maxLength(100),
    description: vine.string(),
    favorite: vine.boolean(),
    color: vine.enum(allowedColors),
})

export type CreateNoteDto = Infer<typeof createNoteValidator>