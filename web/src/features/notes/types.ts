export type NoteColor = "red" | "blue" | "green" | "yellow";

export type Note = {
  content: string;
  id: string;
  title: string;
  description: string;
  favorite: boolean;
  color: NoteColor | string;
  created_at: string;
  updated_at: string;
  user_id: string; 
};

export type CreateNoteDTO = {
  title: string;
  description: string;
  color?: NoteColor;
  favorite?: boolean;
};

export type UpdateNoteDTO = {
  title: string;
  description: string;
  favorite: boolean;
  color: NoteColor;
};
