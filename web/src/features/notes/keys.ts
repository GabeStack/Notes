export const notesKeys = {
  all: ["notes"] as const,
  list: () => [...notesKeys.all, "list"] as const,
  detail: (id: string) => [...notesKeys.all, "detail", id] as const, // 🔁 string
};