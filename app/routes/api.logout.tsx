import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { destroySession,getSession } from '~/services/session.server';

// Define the action function for handling POST requests
export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie") || "");

  return new Response(
    JSON.stringify({success:true}),
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      }
    }
  )
};