import { TNote } from "~/Types/Note";
import sequelize from "./db.server";
import {Notes} from "./models/notes.model";

// Get all notes
export async function getNotes(query:string): Promise<TNote[]> {
    if(query){
        const notes = await Notes.findAll();
        console.log("this is this",notes);
        return [];
    }
    return [];  
}

// Add a new note
export async function setNote(note: TNote): Promise<void> {
    const query = `
        INSERT INTO notes (id, title, body, created_at, updated_at, stared)
        VALUES (:id, :title, :body, :created_at, :updated_at, :stared)
    `;
    await sequelize.query(query, {
        replacements: {
            id: note.id,
            title: note.title,
            body: note.body || null,
            created_at: note.created_at,
            updated_at: note.updated_at || null,
            stared: note.stared,
        },
    });
}

// Get a note by ID
export async function getNoteById(id: string): Promise<TNote | null> {
    const [results] = await sequelize.query(
        'SELECT * FROM notes WHERE id = :id',
        { replacements: { id } }
    );
    const notes = results as TNote[];
    return notes.length > 0 ? notes[0] : null;
}

// Update an existing note
export async function updateNote(note: TNote): Promise<void> {
    const query = `
        UPDATE notes
        SET title = :title,
            body = :body,
            updated_at = :updated_at,
            stared = :stared
        WHERE id = :id
    `;
    await sequelize.query(query, {
        replacements: {
            id: note.id,
            title: note.title,
            body: note.body || null,
            updated_at: note.updated_at || new Date(),
            stared: note.stared,
        },
    });
}

// Delete a note
export async function deleteNoteById(id: string): Promise<void> {
    await sequelize.query('DELETE FROM notes WHERE id = :id', {
        replacements: { id },
    });
}
