import {LoaderFunction, type MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "Idfy Notes" },
    { name: "Notes", content: "Notes App" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {

  const user = await getSessionUser(request);
  console.log(user)
  return { user };
};

import {useLoaderData, useNavigate} from "@remix-run/react";
import { getSessionUser } from "~/services/session.server";

export default function Index() {
   const navigate = useNavigate();
   const { user } = useLoaderData<typeof loader>();
   console.log(user)

  const handleGetStarted = ()=>{
    const isLoggedIn = Boolean(user)
    if(isLoggedIn){
      navigate('/dashboard')
    }else{
      navigate('/login')
    }
  }

  return (
    <div
    className="min-h-screen bg-cover bg-center flex flex-col items-center"
    style={{
      backgroundImage: "url('/note-bg.jpg')", // Path to your uploaded image
    }}
  >
    {/* Hero Section */}
    <header className="bg-white bg-opacity-60 w-full py-16 text-center shadow-md">
      <h1 className="text-4xl font-bold text-gray-700">Idfy Notes</h1>
      <p className="mt-2 text-lg text-gray-600">
        Take notes, organize your ideas, and boost your productivity.
      </p>
      <button className="mt-6 bg-blue-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-blue-400 transition"
      onClick={handleGetStarted}
      >
        Get Started
      </button>
    </header>

    {/* Features Section */}
    <section className="py-16 w-full flex flex-col items-center bg-white bg-opacity-80">
      <h2 className="text-2xl font-bold text-gray-700">Why Choose Idfy Notes?</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-gray-50 shadow p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-600">Cloud Sync</h3>
          <p className="text-gray-600 mt-2">Access your notes anywhere.</p>
        </div>
        <div className="bg-gray-50 shadow p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-600">Easy Organization</h3>
          <p className="text-gray-600 mt-2">
            Keep your notes neat and searchable.
          </p>
        </div>
        <div className="bg-gray-50 shadow p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-600">Collaborate</h3>
          <p className="text-gray-600 mt-2">
            Share and edit notes with your team.
          </p>
        </div>
      </div>
    </section>

    {/* Call-to-Action Section */}
    <footer className="bg-blue-100 bg-opacity-60 w-full py-12 text-center">
      <h2 className="text-xl font-bold text-gray-700">
        Start Using Idfy Notes Today
      </h2>
      <p className="mt-2 text-gray-600">It's free and easy to get started!</p>
      <button className="mt-4 bg-green-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-green-400 transition">
        Sign Up for Free
      </button>
    </footer>
  </div>
  );
}
