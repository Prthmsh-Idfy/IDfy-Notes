import { createCookieSessionStorage, Session } from "@remix-run/node";

// Create a session storage instance
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // Name of the cookie
    // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    secrets: [process.env.SESSION_SECRET || "default-secret"], // Replace with a strong secret
    sameSite: "lax", // Helps prevent CSRF attacks
    path: "/", // Cookie is valid for the entire site
    httpOnly: true, // Prevents JavaScript access to cookies
  },
});

export async function getSessionUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie") ?? "");
  const user = session.get("user");

  if (!user) {
    return null;
  }
  return user;
}

export const destroySessionandClearCookie = async (session: Session) => {
  return destroySession(session); // This invalidates the session cookie
};

export const { getSession, commitSession, destroySession } = sessionStorage;
