import { NoteService } from '#services/note_service'
import { createNoteValidator } from '#validators/note'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class NotesController {
  constructor(private readonly noteService: NoteService) {}
  public async index({response, auth}: HttpContext) {
    const user = auth.getUserOrFail()
    const notes = await this.noteService.getNotesByUser(user.id)
    return response.ok(notes)
  }
  public async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createNoteValidator)
    const user = auth.getUserOrFail()
    const note = await this.noteService.createNote({
      ...payload,
      userId: user.id,
    })
    return response.created(note)
  }

  public async update({ request, response, params, auth }: HttpContext) {
    const payload = await request.validateUsing(createNoteValidator)
    const user = auth.getUserOrFail()
    
    // 🔐 Verifica se a nota pertence ao usuário
    const note = await this.noteService.updateNote(params.id, payload, user.id)
    
    return response.ok(note)
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    
    // 🔐 Verifica se a nota pertence ao usuário antes de deletar
     await this.noteService.deleteNote(params.id, user.id)

    return response.noContent()
  }
}
