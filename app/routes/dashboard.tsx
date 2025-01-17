import { LoaderFunction } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData, useSearchParams } from "@remix-run/react";
import { getNotes } from "~/sequelize/data";
import { TNote } from "~/Types/Note";
import NoteCard from "../components/NoteCard";
import { debounce } from "~/common/debounce";
import { useState, useCallback } from "react";
import { getSessionUser } from "~/services/session.server";
import ErrorPage from "~/components/Error";


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

export default function DashBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const { notes, user, error } = useLoaderData<typeof loader>();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.text();
      if(JSON.parse(data)?.success){
        window.location.href = '/ '
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
    setSearchQuery(value); // Update the input immediately
    updateSearchParams(value); // Debounced update of URL params
  };

  if (error) {
    return (
     <ErrorPage error={error}/>
    );
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
            Hi {user?.email}
          </span>
          <div className="flex justify-between w-full h-[100%]">
            <Link
              to={"/newNote"}
              className="p-1 items-center justify-center text-sm text-white bg-blue-500 rounded-lg text-center"
            >
              Add Note
            </Link>
          </div>

          <ul className="hidden sm:flex flex-col p-2 bg-white shadow rounded-lg h-screen w-[100%]" >
            
              {notes &&
                notes.map((note: TNote) => (
                  <li key={note.id}>
                    <h3 className="text-lg font-normal text-slate-900 border-b-[slate-100] border-b-2 pt-1">
                      {note.title}
                    </h3>
                  </li>
                ))}
            
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 w-[100%]">
          {notes.map((note: TNote) => (
            <Link to={`/notes/${note.id}/edit`} key={note.id}>
              <NoteCard key={note.id} note={note} searchQuery={searchQuery} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
