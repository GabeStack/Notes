import { useEffect, useState } from "react";
import { buildUpdatePayload } from "@/features/notes/buildUpdatePayload";
import type { Note, NoteColor } from "@/features/notes/types";
import { Card } from "@/components/ui/card";
import { Check, PaintBucket, Pencil, Star, X } from "lucide-react";
import { useDeleteNote, useUpdateNote } from "@/features/notes/hooks";

const COLORS: NoteColor[] = ["yellow", "red", "blue", "green"];

const cardBg: Record<string, string> = {
  yellow: "bg-[#FFE8AC]",
  red: "bg-red-300",
  blue: "bg-blue-300",
  green: "bg-green-300",
};

export default function NoteCard({ note }: { note: Note }) {
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [isEditing, setIsEditing] = useState(false);
  const [openColors, setOpenColors] = useState(false);

  const [draftTitle, setDraftTitle] = useState(note.title);
  const [draftDescription, setDraftDescription] = useState(
    note.description ?? "",
  );

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(note.title);
      setDraftDescription(note.description ?? "");
    }
  }, [note.title, note.description, isEditing]);

  const canConfirm = draftTitle.trim().length > 0;

  function toggleFavorite() {
    updateNote.mutate({
      id: note.id,
      payload: buildUpdatePayload(note, { favorite: !note.favorite }),
    });
  }

  function changeColor(color: NoteColor) {
    setOpenColors(false);
    updateNote.mutate({
      id: note.id,
      payload: buildUpdatePayload(note, { color }),
    });
  }

  function startEdit() {
    setIsEditing(true);
    setOpenColors(false);
    setDraftTitle(note.title);
    setDraftDescription(note.description ?? "");
  }

  function confirmEdit() {
    if (!canConfirm) return;

    updateNote.mutate(
      {
        id: note.id,
        payload: buildUpdatePayload(note, {
          title: draftTitle,
          description: draftDescription,
        }),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function removeNote() {
    deleteNote.mutate(note.id);
  }

  return (
    <Card
      className={[
        "text-card-foreground flex flex-col border shadow-sm rounded-2xl",
        "py-3 sm:py-2",
        "gap-4 sm:gap-6",
        cardBg[note.color] ?? "bg-[#FFE8AC]",
      ].join(" ")}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 flex items-start justify-between gap-3">
        {isEditing ? (
          <input
            className={[
              "w-full min-w-0 bg-white/70 rounded px-2 py-1 outline-none",
              "text-sm font-bold text-black/90",
            ].join(" ")}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Título"
          />
        ) : (
          <div className="min-w-0 text-sm text-black/90 font-bold truncate">
            {note.title}
          </div>
        )}

        <button
          type="button"
          onClick={toggleFavorite}
          className="shrink-0 h-9 w-9 sm:h-auto sm:w-auto flex items-center justify-center rounded hover:bg-white/40"
          aria-label="Favoritar"
          title="Favoritar"
        >
          <Star
            size={18}
            className={`text-gray-600 ${
              note.favorite ? "fill-yellow-400" : "fill-transparent"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6">
        {isEditing ? (
          <textarea
            className={[
              "w-full bg-white/70 rounded px-2 py-2 outline-none resize-none",
              "text-sm text-black/80",
              "h-24 sm:h-20",
              "overflow-y-auto", // opcional: se quiser scroll também no edit
            ].join(" ")}
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            placeholder="Descrição"
          />
        ) : (
          <div
            className={[
              "text-sm text-black/80",
              "h-24 sm:h-20", // ✅ altura fixa igual ao textarea
              "overflow-y-auto overflow-x-hidden",
              "whitespace-pre-wrap break-words",
              "pr-1",
            ].join(" ")}
          >
            {note.description}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 relative">
          {!isEditing ? (
            <button
              type="button"
              onClick={startEdit}
              className="h-9 w-9 flex items-center justify-center rounded hover:bg-white/40"
              aria-label="Editar"
              title="Editar"
            >
              <Pencil size={18} className="text-gray-800" />
            </button>
          ) : (
            <button
              type="button"
              onClick={confirmEdit}
              disabled={!canConfirm}
              className="h-9 w-9 flex items-center justify-center rounded hover:bg-white/40 disabled:opacity-50"
              aria-label="Confirmar"
              title="Confirmar"
            >
              <Check
                size={18}
                className={canConfirm ? "text-green-700" : "text-gray-400"}
              />
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenColors((v) => !v)}
              className="h-9 w-9 flex items-center justify-center rounded hover:bg-white/40"
              aria-label="Mudar cor"
              title="Mudar cor"
            >
              <PaintBucket size={18} className="text-orange-600" />
            </button>

            {openColors && (
              <div
                className={[
                  "absolute left-0 bottom-11 z-50 bg-white border rounded shadow p-2",
                  "flex gap-2",
                  "max-w-[calc(100vw-2rem)] overflow-x-auto", // mobile: não estoura a tela
                ].join(" ")}
              >
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => changeColor(c)}
                    className={`w-6 h-6 rounded-full shrink-0 ${cardBg[c]}`}
                    aria-label={`Cor ${c}`}
                    title={`Cor ${c}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={removeNote}
          className="h-9 w-9 flex items-center justify-center rounded hover:bg-white/40"
          aria-label="Excluir"
          title="Excluir"
        >
          <X size={18} className="text-gray-800" />
        </button>
      </div>
    </Card>
  );
}
