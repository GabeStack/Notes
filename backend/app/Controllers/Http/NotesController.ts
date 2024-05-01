import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Note from 'App/Models/Note'
import User from 'App/Models/User'
import CreaterNote from 'App/Validators/CreaterNoteValidator'
import NotesUpdate from 'App/Validators/NotesUpdateValidator'

export default class NotesController {
    public async store ({request, response, auth}: HttpContextContract){
        const {title, describe, favorite, color} = await request.validate(CreaterNote)
        const {email} = await auth.authenticate()
        const user = await User.findByOrFail('email', email)
        const note = await user.related('notes').create({
            title,
            describe,
            favorite,
            color,
        })
        return response.created({note})
    }
    public async index ({ response, auth }: HttpContextContract){
        const {email} = await auth.authenticate()
        const user = await User.findByOrFail('email', email)
        const note = await user.related('notes').query()
        return response.ok(note)
    }
    public async update ({request, response}: HttpContextContract){
       const {title, describe, favorite, color} = await request.validate(NotesUpdate)
       const id = request.param('id')
       const note = await Note.findOrFail(id)
        note.title = title
        note.describe = describe
        note.favorite = favorite
        note.color = color
        await note.save()
        return response.ok({note})
    }
}
