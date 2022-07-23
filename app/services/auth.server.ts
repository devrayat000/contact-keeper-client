import { db } from "~/modules/db.server";
import { destroyUserSession } from "./session.server";

type LoginParams = {
  email: string;
};

type RegisterParams = LoginParams & {
  name: string;
  hash: string;
};

// Extraction -> Validation -> Encryption -> Saving -> Tokenizing
export async function register({ name, email, hash }: RegisterParams) {
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
    select: { id: true },
  });
  if (existingUser) {
    return { authError: "User already exists!" };
  }

  return db.user.create({
    data: { name, email, hash },
    select: { id: true },
  });
}

// Extraction -> Validation -> Fetching -> Decryption -> Tokenizing
export async function login({ email }: LoginParams) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, hash: true },
  });
  if (!user) {
    return { authError: "User does not exists!" };
  }
  return user;
}

export function getUser(id: string) {
  return db.user.findUnique({ where: { id } });
}

export async function logout(request: Request) {
  return destroyUserSession(request);
}
