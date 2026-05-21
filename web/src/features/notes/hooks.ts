import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesKeys } from "./keys";
import { createNote, deleteNote, fetchNotes, updateNote } from "./service";
import type { CreateNoteDTO, UpdateNoteDTO } from "./types";

export function useNotes() {
  return useQuery({ 
    queryKey: notesKeys.list(), 
    queryFn: fetchNotes,
    // 🔁 Importante: Só executa se tiver token
    enabled: !!localStorage.getItem('token'),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNoteDTO) => createNote(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: notesKeys.all }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    // 🔁 ID agora é string
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNoteDTO }) =>
      updateNote(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: notesKeys.all }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id), // 🔁 string
    onSuccess: () => qc.invalidateQueries({ queryKey: notesKeys.all }),
  });
}