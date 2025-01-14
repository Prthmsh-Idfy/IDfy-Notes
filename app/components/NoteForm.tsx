import { Dialog } from "@reach/dialog";
import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Note } from "~/Types/Note";

export default function NoteForm({ note, navigate }: { note: Note; navigate: (path: number) => void }){
    const [isStared, setIsStared] = useState(note.stared);
    return(
    <Dialog isOpen={true} onDismiss={() => navigate(-1)} aria-label="Add Note" className="min-w-lg p-4 m-auto">
      <Form method="post">
        <div className="flex flex-col p-4 bg-white shadow rounded-lg">
          <label className="text-lg font-semibold text-slate-900">Title</label>
          <input
            type="text"
            name="title"
            className="p-2 border border-gray-300 rounded-lg"
            placeholder={note.title}
            defaultValue={note.title}
          />
          <label className="text-lg font-semibold text-slate-900">Body</label>
          <textarea
            name="body"
            className="p-2 border border-gray-300 rounded-lg"
            placeholder={note.body}
            defaultValue={note.body}
          />

          <label
            className={`text-lg font-semibold cursor-pointer ${
              isStared ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => setIsStared(!isStared)}
          >
            {isStared ? "★" : "☆"}
          </label>

          <input type="hidden" name="isStared" value={isStared.toString()} />
          <button
            type="submit"
            className="p-2 text-white bg-blue-500 rounded-lg"
          >
            {note.id ? "Update" : "Add"} Note
          </button>
        </div>
      </Form>
    </Dialog>
    )
}