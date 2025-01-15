import { json, type MetaFunction } from "@remix-run/node";
import NoteCard from "~/components/NoteCard";
import { getNotes } from "~/sequelize/data";
import SearchIcon from "~/public/icons8-search.svg";

export const meta: MetaFunction = () => {
  return [
    { title: "Idfy Notes" },
    { name: "description", content: "Notes App" },
  ];
};

import DashBorad from "~/routes/dashboard";
import { Link } from "@remix-run/react";

export default function Index() {

  return (
    <Link to="/dashboard">
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl">Login</h1>
      </div>
    </Link>
  );
}
