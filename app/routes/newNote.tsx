import { ActionFunctionArgs } from "@remix-run/node";
import {redirect, useNavigate } from "@remix-run/react";
import { setNote } from "~/sequelize/data";
import "@reach/dialog/styles.css";
import NoteForm from "~/components/NoteForm";
import { TNote } from "~/Types/Note";
import { v4 as uuidv4 } from "uuid";
import { Dialog } from "@reach/dialog";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const Data = {
    id: uuidv4(),
    title: body.title,
    body: body.body,
    created_at: new Date(),
    stared: body.isStared === "true",
  };
  if(Data && Data?.title)(setNote(Data as TNote));
  return redirect("/dashboard");
};

export default function NewNote() {
  const note = {
    id: "",
    title: "",
    body: "",
    created_at: new Date(),
    stared: false,
  };
  return (
  
         <NoteForm note={note}/>
   
  );
}
