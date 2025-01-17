import { Link } from "@remix-run/react";

export default function ErrorPage({ error }: { error: string }) {
  function showError() {
    switch (error) {
      case "invalid_credentials":
        return "Invalid Credentails";
      default:
        return "UnKnown Error";
    }
  }
  return (
    <div className=" flex flex-col h-screen w-screen justify-center items-center">
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-lg">{error}</p>
          <Link to="/" className="text-blue-500 underline">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
