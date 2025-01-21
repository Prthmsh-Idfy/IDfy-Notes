// routes/api/updateData.jsx
import { json } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";
import { updateNote } from "~/sequelize/data";
import { TNote } from "~/Types/Note";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const noteData = formData.get("note");
  const note: TNote | null = noteData ? JSON.parse(noteData as string) : null;
  if (note) {
    await updateNote(note);
  }

  return ({ success: true });
};
