import { Outlet } from "@remix-run/react";
import { type LoaderArgs, redirect } from "@remix-run/node";

import { requireUserId } from "~/services/session.server";
import { checkAuthenticated } from "~/services/auth.server";
export async function loader({ request }: LoaderArgs) {
  const id = await requireUserId(request);
  const user = await checkAuthenticated(id);

  if (!user) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["_next", redirectTo]]);
    return redirect(`/login?${searchParams}`);
  }
  return null;
}

export default function Index() {
  return <Outlet />;
}
