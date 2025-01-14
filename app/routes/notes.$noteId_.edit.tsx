import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node"
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react"
import { getNoteById, updateNote } from "~/sequelize/data"

import invariant from "tiny-invariant";
import NoteForm from "~/components/NoteForm";
import { Note } from "~/Types/Note";

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.noteId, "Note ID is required");
  
    const note = getNoteById(params.noteId as string);
    if (!note) {
      throw new Response("Note not found", { status: 404 });
    }
    return json({ note });
  };

export const action = async ({ params,request }: ActionFunctionArgs) => {
  console.log(request);
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const Data = {
    id: params.noteId,
    title: body.title,
    body: body.body,
    updated_at: new Date(),
    stared: body.isStared === "true",
  };
  if(Data && Data?.title)(updateNote(Data as Note));
  return redirect("/");
};

export default function NoteEdit(){
    const {note} = useLoaderData<typeof loader>()
    const navigate = useNavigate();
    return (
        <NoteForm note={note} navigate={navigate}/>
    )
}