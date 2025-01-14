import { Note } from "~/Types/Note";
import sequelize from "./db.server";

export let notes: Note[] = [];

export async function getNotes(): Promise<Note[]> {
    const [results] = await sequelize.query('SELECT * FROM notes');
    console.log(results);
    return Array.isArray(results) ? (results as Note[]) : [];
}

export function setNote(note: Note){
    notes.push(note);
}

export function getNoteById(id: string) {
    const note = notes.find((n) => n.id === id);
    return note || null; // Return null explicitly if no note is found
  }
  

export function updateNote(note: Note) {
    let index = notes.findIndex((n) => n.id === note.id);
    notes[index] = note;
}