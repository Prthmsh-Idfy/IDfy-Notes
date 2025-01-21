import { TNote } from "~/Types/Note";
import { Op } from "sequelize";
import { Notes } from "./models/notes.model";

// Get all notes
export async function getNotes(
  userid: string,
  query: string
): Promise<TNote[]> {
  if (query) {
    // Search for notes that match the query in the title or body
    const notes = await Notes.findAll({
      where: {
        userid: userid,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { body: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });
    return notes.map((note) => note.toJSON() as TNote);
  }

  // Return all notes if no query is provided
  const notes = await Notes.findAll({
    where: {
      userid,
    },
  });
  return notes.map((note) => note.toJSON() as TNote);
}

// Add a new note
export async function setNote(note: TNote): Promise<void> {
  await Notes.create(note);
}

// Get a note by ID
export async function getNoteById(id: string): Promise<TNote | null> {
  const note = await Notes.findByPk(id);
  return note ? (note.toJSON() as TNote) : null;
}

// Update an existing note
export async function updateNote(note: TNote): Promise<void> {
  await Notes.update(note, {
    where: {
      id: note.id,
    },
  });
}

// Delete a note
export async function deleteNoteById(id: string): Promise<void> {
  await Notes.destroy({
    where: {
      id,
    },
  });
}
