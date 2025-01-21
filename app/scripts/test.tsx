import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, redirect, useLoaderData, useSearchParams } from "@remix-run/react";
import { deleteNoteById, getNoteById, getNotes, setNote, updateNote } from "~/sequelize/data";
import { TNote } from "~/Types/Note";
import NoteCard from "../components/NoteCard";
import { debounce } from "~/common/debounce";
import { useState, useCallback } from "react";
import { getSessionUser } from "~/services/session.server";
import ErrorPage from "~/components/Error";
import NewNote from "~/routes/notes.newNote";
import NoteForm from "~/components/NoteForm";
import { v4 as uuidv4 } from "uuid";


export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const user = await getSessionUser(request);
    if (!user) {
      return redirect('/login');
    }

    const notes = await getNotes(user?.email, search);
    return { notes, user };
  } catch (error) {
    console.error("Error in loader:", error);
    return { notes: [], user: null, error: "Failed to load data. Please try again later." };
  }
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const intent = formData.get("intent");

  const user = await getSessionUser(request);

  if (!user) {
    return redirect("/login");
  }

  const commonData = {
    title: body.title as string,
    body: body.body as string,
    stared: body.isStared === "true",
  };

  switch (intent) {
    case "create": {
      const newNote:TNote = {
        id: uuidv4(),
        userid: user.userid,
        ...commonData,
        created_at: new Date(),
      };

      if (newNote.title) {
        await setNote(newNote);
      }
      return redirect("/notes");
    }

    case "update": {
      if (!params.noteId) {
        throw new Error("Note ID is required for updating a note.");
      }
      const existingNote = await getNoteById(params.noteId);
      const updatedNote:TNote = {
        userid: user.userid,
        created_at: existingNote?.created_at || new Date(),
        id: params.noteId,
        ...commonData,
        updated_at: new Date(),
      };

      if (updatedNote.title) {
        await updateNote(updatedNote);
      }

      return redirect("/notes");
    }

    case "delete": {
      if (!params.noteId) {
        throw new Error("Note ID is required for deleting a note.");
      }

      await deleteNoteById(params.noteId);
      return redirect("/notes");
    }

    default: {
      return redirect("/notes");
    }
  }
};

export default function DashBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<TNote | null>(null);

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const openModal = (note: TNote | null = null) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };
  const {notes}:TNote|any= useLoaderData<typeof loader>();


  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <Form method="get">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-black"
          />
        </Form>
        <button className="p-2 bg-red-500 rounded-lg" onClick={() => console.log("Logout")}>
          Logout
        </button>
      </nav>

      <div className="flex flex-col items-start justify-start min-h-screen w-[100%] p-4">
        <button
          onClick={() => openModal()}
          className="mb-4 p-2 bg-blue-500 text-white rounded-lg"
        >
          Add Note
        </button>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {notes.map((note:TNote) => (
            <div
              key={note.id}
              onClick={() => openModal(note)}
              className="cursor-pointer"
            >
              <NoteCard note={note} searchQuery={searchQuery} />
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}
