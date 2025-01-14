import { json, type MetaFunction } from "@remix-run/node";
import NoteCard from "~/components/NoteCard";
import { getNotes } from "~/sequelize/data";
import SearchIcon from "~/public/icons8-search.svg";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import NoteForm from "~/routes/newNote";
import { Note } from "~/Types/Note";

export const loader: LoaderFunction = async () => {
  let notes = await getNotes();
  return { notes };
};

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <div className="relative w-[65%]">
  <input
    type="text"
    placeholder="Search"
    className="p-2 border border-gray-300 rounded-lg w-full pl-10"
  />
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

        <div>
        <img src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/58ff5e7e-cf67-41d6-a2e7-1a64ce0fea3d.png" alt="note" className="h-10 w-20"></img>
        </div>
      </nav>
      <div className="flex items-start justify-start min-h-screen w-[100%] p-2">
      <ul className="flex flex-col p-2 bg-white shadow rounded-lg h-[90vh] w-[30%]">
        <div className="flex justify-between w-full h-8"> 
          <Link
            to={"/newNote"}
            className="p-1 items-center justify-center text-sm text-white bg-blue-500 rounded-lg text-center"
          >
            Add Note
          </Link>
        </div>
        <br />
        {notes.map((note: Note) => (
          <li key={note.id}>
            <h3 className="text-lg font-normal text-slate-900 border-b-[slate-100] border-b-2 pt-1">
              {note.title}
            </h3>
          </li>
        ))}
      </ul>
      <div></div>
      <div className="grid grid-cols-1 gap-4 pl-4 pr-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note: Note) => (
          <Link to={`/notes/${note.id}/edit`} key={note.id}>
            <NoteCard key={note.id} note={note} />
          </Link>
        ))}
      </div>
    </div>

    </div>
  );
}
