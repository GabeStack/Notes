import { api } from "../../api/axios";
import type { CreateNoteDTO, Note, UpdateNoteDTO } from "./types";

export async function fetchNotes(): Promise<Note[]> {
  const { data } = await api.get<Note[]>("/notes");
  return data;
}

export async function createNote(payload: CreateNoteDTO): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

// 🔁 ID agora é string
export async function updateNote(id: string, payload: UpdateNoteDTO): Promise<Note> {
  const { data } = await api.put<Note>(`/notes/${id}`, payload);
  return data;
}

// 🔁 ID agora é string
export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}