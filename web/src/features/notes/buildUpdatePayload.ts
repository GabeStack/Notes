import type { Note, NoteColor, UpdateNoteDTO } from "./types";

export function buildUpdatePayload(
  note: Note,
  changes: Partial<Pick<UpdateNoteDTO, "title" | "description" | "favorite" | "color">>
): UpdateNoteDTO {
  return {
    title: (changes.title ?? note.title).trim(),
    description: (changes.description ?? note.description).trim(),
    favorite: changes.favorite ?? note.favorite,
    color: (changes.color ?? note.color) as NoteColor,
  };
}