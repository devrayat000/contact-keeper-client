import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { User } from "@prisma/client";
import { getUser } from "~/services/auth.server";
import { requireUserId } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const id = await requireUserId(request);
  const user = await getUser(id);
  return user;
}

export default function ProfilePage() {
  const user = useLoaderData<User>();
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
