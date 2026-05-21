import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { useCreateNote } from "../../features/notes/hooks";
import type { NoteColor } from "../../features/notes/types";

const COLORS: NoteColor[] = ["red", "blue", "green", "yellow"];

const bgColors: Record<NoteColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
};

function CreateNote() {
  const createNoteMutation = useCreateNote();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [color, setColor] = useState<NoteColor>("yellow");
  const [openColors, setOpenColors] = useState(false);

  const canSave = useMemo(() => {
    return title.trim().length > 0;
  }, [title]);

  function handleSave() {
    if (!canSave) return;
    if (createNoteMutation.isPending) return;

    createNoteMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        favorite,
        color,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setFavorite(false);
          setColor("yellow");
          setOpenColors(false);
        },
      }
    );
  }

  function handleTextareaKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // impede quebra de linha
      handleSave();
    }
  }

  return (
    <div className="container max-w-full px-8 mt-8">
      <div className="relative w-full max-w-3xl mx-auto mt-8">
        <Input
          className="h-9 rounded-[5px] border px-3 py-1 md:text-sm outline-none bg-white w-full pr-24 rounded-b-none font-bold text-[#333333] text-sm"
          placeholder="Título"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Favorito */}
        <button
          type="button"
          onClick={() => setFavorite((v) => !v)}
          className="absolute right-12 top-0 h-full w-12 flex items-center justify-center text-muted-foreground hover:text-yellow-500"
          aria-label="Favoritar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        </button>

        {/* Cor */}
        <button
          type="button"
          onClick={() => setOpenColors((v) => !v)}
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center"
          aria-label="Escolher cor"
        >
          <div className={`w-5 h-5 rounded ${bgColors[color]}`} />
        </button>

        {openColors && (
          <div className="absolute right-0 top-10 z-50 bg-white border rounded shadow p-2 flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setOpenColors(false);
                }}
                className={`w-6 h-6 rounded-full ${bgColors[c]} ring-offset-2 ${
                  c === color ? "ring-2 ring-black" : ""
                }`}
                aria-label={`Cor ${c}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mx-auto mb-8">
        <textarea
          className="border-input placeholder:text-muted-foreground flex min-h-16 rounded-[5px] border px-3 py-2 text-base shadow-xs outline-none md:text-sm bg-white w-full resize-none rounded-t-none h-24"
          placeholder="Criar notas"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
        />
      </div>

      {createNoteMutation.isError && (
        <p className="w-full max-w-3xl mx-auto mb-8 text-red-600">
          Erro ao criar nota.
        </p>
      )}
    </div>
  );
}

export default CreateNote;