import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useActionData } from "@remix-run/react";
import { authenticator, isOnboarded, registerUser } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import { Form } from "@remix-run/react";
import { useState } from "react";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.clone().formData();
    const isNewUser = formData.get("isNewUser") === "true";
    console.log("IsNewUser:", isNewUser);

    let errors: Record<string, string> = {};

    if (isNewUser) {
      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const password = formData.get("password")?.toString() || "";
      const confirmPassword = formData.get("confirmpassword")?.toString();

      // Input validation
      if (!email.includes("@")) {
        errors.email = "Invalid email address.";
      }

      if (password.length < 6) {
        errors.password = "Password should be at least 6 characters.";
      }

      if (!email || !password || !confirmPassword) {
        errors.allMandatory = "All fields are mandatory.";
      }

      if (password !== confirmPassword) {
        errors.passMatch = "Passwords didn't match.";
      }

      // Return errors if validation fails
      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      // Register the user in the database
      const user = await registerUser(name, email, password);

      if (!user) {
        errors.registration = "Registration failed. Please try again.";
        return json({ errors });
      }

      // Create a session after successful registration
      const session = await getSession(request.headers.get("Cookie") ?? "");
      session.set("user", user);

      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });


      return redirect("/notes", { headers });
    } else {
      // Authenticate existing user
      const user = await authenticator.authenticate("user-pass", request);

      if (!user) {
        errors.invalid = "Invalid email or password.";
        return json({ errors });
      }

      const session = await getSession(request.headers.get("Cookie") ?? "");
      session.set("user", user);

      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });
      console.log(session)

      if (await isOnboarded(user)) {
        return redirect("/notes", { headers });
      } else {
        return redirect("/login", { headers });
      }
    }
  } catch (error) {
    console.error("Error in action function:", error);
    return json({
      errors: { server: "An unexpected error occurred. Please try again later." },
    });
  }
}

export default function Login() {
  const [isNewUser, setIsNewUser] = useState(false);
  const data = useActionData<typeof action>();

  const handleRegisterHere = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-400 justify-center items-center">
      <Form method="post" className="flex flex-col bg-white shadow-lg p-6 rounded-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isNewUser ? "Register" : "Login"}
        </h1>
        {data?.errors && (
          <div className="text-red-500 text-sm mb-3">
            {Object.values(data.errors).map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
          </div>
        )}
        {isNewUser && (
          <input
            placeholder="Name"
            type="name"
            name="name"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
        )}
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
            {isNewUser ? "Already Registered?" : "Not Registered yet?"}
          </span>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isNewUser ? "Register" : "Login"}
          </button>
        </div>
      </Form>
    </div>
  );
}
