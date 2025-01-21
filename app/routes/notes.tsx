import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { IoGridOutline } from "react-icons/io5";
import { FaRegListAlt } from "react-icons/fa";

import {
  Form,
  Link,
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
  useSearchParams,
  useFetcher,
} from "@remix-run/react";
import {
  deleteNoteById,
  getNoteById,
  getNotes,
  setNote,
  updateNote,
} from "~/sequelize/data";
import { TNote } from "~/Types/Note";
import NoteCard from "../components/NoteCard";
import { debounce } from "~/common/debounce";
import { useState, useCallback, useEffect, useTransition } from "react";
import { getSessionUser } from "~/services/session.server";
import ErrorPage from "~/components/Error";
import NoteForm from "~/components/NoteForm";
import { v4 as uuidv4 } from "uuid";
import { METHODS } from "http";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const user = await getSessionUser(request);
    if (!user) {
      return redirect("/login");
    }

    const notes = await getNotes(user?.email, search);
    return { notes, user };
  } catch (error) {
    console.error("Error in loader:", error);
    return {
      notes: [],
      user: null,
      error: "Failed to load data. Please try again later.",
    };
  }
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const intent = formData.get("intent");
  const noteId = formData.get("noteId")?.toString();
  console.log("note:", noteId);

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
      const newNote: TNote = {
        id: uuidv4(),
        userid: user.userid,
        ...commonData,
        created_at: new Date(),
        status:"ongoing"
      };

      if (newNote.title) {
        await setNote(newNote);
      }
      return { success: true };
    }

    case "update": {
      if (!noteId) {
        throw new Error("Note ID is required for updating a note.");
      }
      const existingNote = await getNoteById(noteId);
      const updatedNote: TNote = {
        userid: user.userid,
        created_at: existingNote?.created_at || new Date(),
        id: noteId,
        ...commonData,
        updated_at: new Date(),
        status:existingNote?.status || "ongoing"
      };

      if (updatedNote.title) {
        await updateNote(updatedNote);
      }

      return { success: true };
    }

    case "delete": {
      if (!noteId) {
        throw new Error("Note ID is required for deleting a note.");
      }

      await deleteNoteById(noteId);
      return { success: true };
    }

    default: {
      return { success: true };
    }
  }
};

export default function DashBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  let { notes, user, error } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<TNote | null>(null);
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher({key:"updateStatus"});
  const [isGrid,setIsGrid] = useState(true)

  //this function handles logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.text();
      if (JSON.parse(data)?.success) {
        window.location.href = "/ ";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateSearchParams = useCallback(
    debounce((value: string) => {
      setSearchParams({ search: value });
    }, 300),
    [setSearchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearchParams(value);
  };

  const openModal = (note: TNote | null = null) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  useEffect(() => {
    if (actionData?.success) {
      setIsModalOpen(false);
      window.location.href = "/notes";
    }
  }, [actionData]);

  const onDragStart = (e: any, id: string): void => {
    console.log("onDragStart:", id);
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (e: any): void => {
    e.preventDefault();
    // alert("onDrop over")
  };

  const onDrop = (e: any, status: string): void => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    let updatedNote: TNote | undefined = notes.find((note: TNote) => note.id === id);
    if (updatedNote) {
      updatedNote.status = status;
      console.log(updatedNote)
      fetcher.submit(
        { note: JSON.stringify(updatedNote) },
        { method: "post", action: "/api/updateNoteStatus" }
      );
    }
    
    
   
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <div className="relative w-[65%]">
          <Form method="get">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-lg w-full pl-10 text-black"
            />
          </Form>
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div onClick={()=>setIsGrid(prev=>!prev)}>
            {isGrid?<FaRegListAlt/>:<IoGridOutline/>}
          </div>
          <button
            onClick={handleLogout}
            className="text-white p-2 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
          <img
            src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/58ff5e7e-cf67-41d6-a2e7-1a64ce0fea3d.png"
            alt="note"
            className="h-10 w-20"
          />
        </div>
      </nav>

      <div className="flex flex-col sm:flex-row items-start justify-start min-h-screen w-[100%] p-2 gap-2">
        <div className="flex flex-col p-2 bg-white shadow rounded-lg h-max w-[100%] sm:w-[20%] mb-2">
          <span>
            Hi <b>{user?.name}</b>
          </span>
          <div className="flex justify-between w-full h-[100%]">
            <button
              onClick={() => openModal()}
              className="mb-4 p-2 bg-blue-500 text-white rounded-lg"
            >
              Add Note
            </button>
          </div>
          <h3>Completed Tasks</h3>
          <ul
            className="hidden sm:flex flex-col p-2 bg-white shadow rounded-lg h-screen w-[100%] gap-3"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, "completed")}
          >
            {notes.filter((note: TNote) => note.status === "completed")
            .map((note: TNote) => (
              <div
                key={note.id}
                onClick={() => openModal(note)}
                className="cursor-pointer"
              >
                <NoteCard
                  note={note}
                  searchQuery={searchQuery}
                  onDragStart={onDragStart}
                />
              </div>
            ))}
          </ul>
        </div>
        <div
          className={
            isGrid
            ?"grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 grid-rows-[auto_auto_minmax(100px,_1fr)] w-full h-screen"
            :"flex flex-col gap-3 w-full"
          }
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, "ongoing")}
        >
          {notes.filter((note: TNote) => note.status === "ongoing")
          .map((note: TNote) => (
            <div
              key={note.id}
              onClick={() => openModal(note)}
              className="cursor-pointer"
            >
              <NoteCard
                note={note}
                searchQuery={searchQuery}
                onDragStart={onDragStart}
              />
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <NoteForm note={currentNote} closeModal={closeModal} />}
    </div>
  );
}
