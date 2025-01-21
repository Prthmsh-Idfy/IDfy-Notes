import { useState } from "react";
import { Form } from "@remix-run/react";
import { TNote } from "~/Types/Note";

export default function NoteForm({
  note,
  closeModal,
}: {
  note: TNote | null;
  closeModal: () => void;
}) {
  const [isStared, setIsStared] = useState(note?.stared || false);
  const [errors, setErrors] = useState<{ title?: string }>({});


  return (
    <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <Form method="post"className="flex flex-col space-y-4">
        <input type="hidden" name="noteId" value={note?.id || ""} />
          <input type="hidden" name="isStared" value={isStared.toString()} />
          <label className="text-lg font-semibold">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={note?.title || ""}
            className="p-2 border rounded-lg"
          />
          {errors.title && <span className="text-red-500">{errors.title}</span>}

          <label className="text-lg font-semibold">Body</label>
          <textarea
            name="body"
            defaultValue={note?.body || ""}
            className="p-2 border rounded-lg"
          />

          <label
            className={`cursor-pointer ${
              isStared ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => setIsStared(!isStared)}
          >
            {isStared ? "★" : "☆"}
          </label>

          <div className="flex space-x-4">
            <button
              type="submit"
              name="intent"
              value={note ? "update" : "create"}
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              {note ? "Update" : "Create"}
            </button>
            {note && (
              <button
                type="submit"
                name="intent"
                value="delete"
                className="p-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            )}
          </div>
        </Form>
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>
    </div>
  );
}
