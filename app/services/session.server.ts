import { redirect } from "@remix-run/node";
import { storage } from "~/utils/session.server";

export async function createUserSession(
  userId: string,
  redirectTo: string = "/"
) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  if (!session.has("userId") || !session.get("userId")) {
    const searchParams = new URLSearchParams([["_next", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const userId = session.get("userId") as string;
  return userId;
}

export async function destroyUserSession(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
