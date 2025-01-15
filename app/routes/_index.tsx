import {type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Idfy Notes" },
    { name: "Notes", content: "Notes App" },
  ];
};

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
