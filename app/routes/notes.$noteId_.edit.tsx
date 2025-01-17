import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node"
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react"
import { deleteNoteById, getNoteById, updateNote } from "~/sequelize/data"

import invariant from "tiny-invariant";
import NoteForm from "~/components/NoteForm";
import { TNote } from "~/Types/Note";

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.noteId, "Note ID is required");
  
    const note = await getNoteById(params.noteId as string);
    if (!note) {
      throw new Response("Note not found", { status: 404 });
    }
    return json({ note });
  };

export const action = async ({ params,request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const intent = formData.get("intent");
  
  const Data = {
    id: params.noteId,
    title: body.title,
    body: body.body,
    updated_at: new Date(),
    stared: body.isStared === "true",
  };

  switch (intent) {
    case "update":
        if(Data && Data?.title)(await updateNote(Data as TNote));
        return redirect("/dashboard");
    case "delete":
        await deleteNoteById(params.noteId as string);
      return redirect("/dashboard");
    default:
        return redirect("/dashboard");
  }
};

export default function NoteEdit(){
    const {note} = useLoaderData<typeof loader>()
    return (
        <NoteForm note={note}/>
    )
}