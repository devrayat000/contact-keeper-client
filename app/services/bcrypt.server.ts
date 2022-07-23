import * as bcrypt from "bcryptjs";

export async function hashPassword(password: string, rounds = 10) {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(password, salt);
}

export function validateHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
