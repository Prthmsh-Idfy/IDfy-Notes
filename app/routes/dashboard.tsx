//dashboard.tsx
import { LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getNotes } from "~/sequelize/data";
import { TNote } from "~/Types/Note";
import NoteCard from "../components/NoteCard";
import { debounce } from "~/common/debounce";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const notes = await getNotes(search);
  // const DebouncedGetNotes = debounce(getNotes, 300);
  // const notes = DebouncedGetNotes(search);

  return { notes };
};

export default function DashBoard() {
  const [searchParams, setSearchParams] = useSearchParams(); // Get search parameters from URL

  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const searchTerm = e.target.value;
    setSearchParams({ search: searchTerm });
  };
    const { notes } = useLoaderData<typeof loader>();
      return (
        <div>
          <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <h1 className="text-2xl font-semibold">Notes</h1>
            <div className="relative w-[65%]">
              <Form method="get">
              <input
                type="text"
                placeholder="Search"
                value={searchParams.get("search") || ""}
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
    
            <div>
              <img
                src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/58ff5e7e-cf67-41d6-a2e7-1a64ce0fea3d.png"
                alt="note"
                className="h-10 w-20"
              ></img>
            </div>
          </nav>
          <div className="flex items-start justify-start min-h-screen w-[100%] p-2">
            <ul className="flex flex-col p-2 bg-white shadow rounded-lg h-[90vh] w-[20%]">
              <div className="flex justify-between w-full h-8">
                <Link
                  to={"/newNote"}
                  className="p-1 items-center justify-center text-sm text-white bg-blue-500 rounded-lg text-center"
                >
                  Add Note
                </Link>
              </div>
              <br />
              {notes.map((note: TNote) => (
                <li key={note.id}>
                  <h3 className="text-lg font-normal text-slate-900 border-b-[slate-100] border-b-2 pt-1">
                    {note.title}
                  </h3>
                </li>
              ))}
            </ul>
            <div></div>
            <div className="grid grid-cols-1 gap-4 pl-4 pr-4 md:grid-cols-2 lg:grid-cols-3 w-[80%]">
              {notes.map((note: TNote) => (
                <Link to={`/notes/${note.id}/edit`} key={note.id}>
                  <NoteCard key={note.id} note={note} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
}