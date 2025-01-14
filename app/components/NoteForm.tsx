import { useState } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { TNote } from "~/Types/Note";


export default function NoteForm({
  note,
}: {
  note: TNote;
}) {
  const [isStared, setIsStared] = useState(note.stared);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    // Navigate after closing modal (ensuring background is visible until modal is closed)
    setTimeout(() => {
      navigate(-1); // This will navigate back after modal closes
    }, 300); // Adding a small delay to allow the modal to close smoothly
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-50 relative">
            <Form method="post" className="flex flex-col space-y-4">
              <label className="text-lg font-semibold text-gray-900">Title</label>
              <input
                type="text"
                name="title"
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Enter title"
                defaultValue={note.title}
              />

              <label className="text-lg font-semibold text-gray-900">Body</label>
              <textarea
                name="body"
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Enter body"
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
              
             <div className="flex flex-row w-full justify-between">
             <button
                type="submit"
                name="intent"
                value={note.id ? "update" : "create"}
                className="p-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {note.id ? "Update" : "Add"} Note
              </button>
              {note.id && (
                <button
                  type="submit" 
                  name="intent"
                  value="delete"
                  className="p-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete Note
                </button>
              )} 
             </div>
            </Form>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
