import { ActionFunctionArgs } from "@remix-run/node";
import {redirect, useNavigate } from "@remix-run/react";
import { setNote } from "~/sequelize/data";
import "@reach/dialog/styles.css";
import NoteForm from "~/components/NoteForm";
import { Note } from "~/Types/Note";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const Data = {
    id: Math.random().toString(),
    title: body.title,
    body: body.body,
    created_at: new Date(),
    stared: body.isStared === "true",
  };
  if(Data && Data?.title)(setNote(Data as Note));
  return redirect("/");
};

export default function NewNote() {
  const navigate = useNavigate();
  const note = {
    id: "",
    title: "",
    body: "",
    created_at: new Date(),
    stared: false,
  };
  return (
    <NoteForm note={note} navigate={navigate}/>
  );
}
