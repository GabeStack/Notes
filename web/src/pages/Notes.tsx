import { useMemo } from "react";
import { useNotes } from "@/features/notes/hooks";
import type { Note } from "@/features/notes/types";
import Header from "@/components/header";
import CreateNote from "@/components/createNote";
import NoteCard from "@/components/NoteCard";
import { SearchProvider } from "@/components/header/search-context";
import { useSearch } from "@/components/header/search-context"; // 👈 add

function Section({ title, notes }: { title: string; notes: Note[] }) {
  if (notes.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">
        {title}
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {notes.map((note) => (
          <li key={note.id} className="min-w-0">
            <NoteCard note={note} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function AppContent() {
  const { data: notes = [], isLoading, isError } = useNotes();
  const { search } = useSearch(); // 👈 aqui

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      // Ajuste os campos conforme teu type Note
      const title = (n.title ?? "").toLowerCase();
      const content = (n.content ?? "").toLowerCase();

      return title.includes(q) || content.includes(q);
    });
  }, [notes, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [filtered]);

  const favorites = useMemo(() => sorted.filter((n) => n.favorite), [sorted]);
  const others = useMemo(() => sorted.filter((n) => !n.favorite), [sorted]);

  if (isLoading) return <div className="px-4 py-6">Carregando...</div>;
  if (isError) return <div className="px-4 py-6">Erro ao carregar notas.</div>;

  return (
    <>
      <Header />
      <CreateNote />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="grid gap-6 sm:gap-8 mb-8">
          <Section title="Favoritos" notes={favorites} />
          <Section title="Outros" notes={others} />

          {favorites.length === 0 && others.length === 0 && (
            <p className="text-sm sm:text-base">Nenhuma nota encontrada</p>
          )}
        </div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <SearchProvider>
      <AppContent />
    </SearchProvider>
  );
}