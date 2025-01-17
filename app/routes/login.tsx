import { ActionFunctionArgs } from "@remix-run/node";
import { redirect, useParams, useSearchParams } from "@remix-run/react";
import { authenticator, isOnboarded, registerUser } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import { Form } from "@remix-run/react";
import { useState } from "react";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.clone().formData();
    const isNewUser = formData.get("isNewUser") === "true";
    console.log("IsNewUser:",isNewUser)
    if (isNewUser) {
      const email = formData.get("email")?.toString() || "";
      const password = formData.get("password")?.toString() || "";
      const confirmPassword = formData.get("confirmpassword")?.toString();

      if (!email || !password || !confirmPassword) {
        return redirect("/login?error=invalid_credentials")
      }

      if (password !== confirmPassword) {
        return redirect("/login?error=no_passwor_match")
      }

      const user = await registerUser(email, password); // Register the user in the database
      if (!user) {
        return redirect("/login?error=registration_failed");
      }

      // Create session after successful registration
      const session = await getSession(request.headers.get("Cookie") ?? "");
      session.set("user", user);

      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });

      return redirect("/dashboard", { headers });
    } else {
      const user = await authenticator.authenticate("user-pass", request);
      console.log(user)

      if(user===null){
        return redirect('/login?error=invalid_credentials')
      }

      const session = await getSession(request.headers.get("Cookie") ?? "");
      session.set("user", user);

      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });

      if (await isOnboarded(user)) {
        return redirect("/dashboard", { headers });
      } else {
        return redirect("/login", { headers });
      }
    }
  } catch (error) {
    console.log(error)
    return redirect("/login?error=invalid_credentials");
  }
}

export default function Login() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginError,setLoginError] = useState(searchParams.get("error")||"")

  const handleRegisterHere = () => {
    setIsNewUser(!isNewUser);
  };
  return (
    
    <div className="flex flex-col h-screen w-screen bg-slate-400 justify-center items-center">
      <Form method="post" className="flex flex-col bg-white shadow-lg p-6 rounded-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isNewUser ?"Register":"Login"}
        </h1>
        <input
          placeholder="Email"
          type="email"
          name="email"
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        {isNewUser && (
          <input
            placeholder="Confirm Password"
            type="password"
            name="confirmpassword"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
        )}
        <input type="hidden" name="isNewUser" value={isNewUser.toString()} />
        <div className="w-full flex justify-between items-center text-sm">
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={handleRegisterHere}
          >
            {isNewUser ? "Already Registered?":"Not Registered yet?"}
          </span>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isNewUser ?"Register":"Login"}
          </button>
        </div>
      </Form>
    </div>
  );
}

