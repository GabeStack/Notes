import Note from '#models/note'
import type { CreateNoteDto } from '#validators/note'
import BadRequestException from '#exceptions/bad_request_exception'

type CreateNoteInput = CreateNoteDto & {
  userId: number
}

export class NoteService {
  public async getNotesByUser(userId: number) {
    if (!userId || userId <= 0) {
      throw new BadRequestException('User ID inválido')
    }

    return await Note.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
  }

  public async createNote(data: CreateNoteInput) {
    if (!data.userId || data.userId <= 0) {
      throw new BadRequestException('Usuário inválido para criar a nota')
    }

    const note = await Note.create(data)
    return note
  }

  public async updateNote(id: number, data: Partial<CreateNoteDto>, userId: number) {
        if (!userId || userId <= 0) {
      throw new BadRequestException('User ID inválido')
    }

    if (!id || id <= 0) {
      throw new BadRequestException('ID da nota inválido')
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Nenhum dado foi enviado para atualização')
    }

    const note = await Note.find(id)

    if (!note) {
      throw new BadRequestException('Nota não encontrada')
    }

    note.merge(data)
    await note.save()

    return note
  }

  public async deleteNote(id: number, userId: number) {
    
        if (!userId || userId <= 0) {
      throw new BadRequestException('User ID inválido')
    }

    if (!id || id <= 0) {
      throw new BadRequestException('ID da nota inválido')
    }

    const note = await Note.find(id)

    if (!note) {
      throw new BadRequestException('Nota não encontrada')
    }

    await note.delete()
  }
}