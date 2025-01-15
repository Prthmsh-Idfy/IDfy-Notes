import { getHighlightedText } from "~/common/getHighlightedText";
import { TNote } from "~/Types/Note";

export default function NoteCard({ note,searchQuery }: { note: TNote ,searchQuery:string}) {
  return (
    <div className="p-4 bg-white shadow rounded-lg"
    draggable="true"
    >
      <h2 className="text-lg font-semibold text-slate-900">{getHighlightedText(note.title,searchQuery)}</h2>
      <p className="text-gray-500">{getHighlightedText(note.body|| "",searchQuery)}</p>
      <div className="flex mt-4">
        <span className="text-gray-400 text-sm">
        {note.updated_at
    ? `Updated at ${note.updated_at?.toDateString()}`
    : `Created at ${note.created_at?.toDateString()}`}

        </span>
        <button
          className={`${note.stared ? "text-yellow-500" : "text-gray-400"} pl-4 text-sm`}
        >
        {
            note.stared ? "★" : "☆"
        }
        </button>
      </div>
    </div>
  );
}
