import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .max(32)
    .min(8, "Password must contain at least 8 character(s)"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(6, "Name must contain at least 6 character(s)"),
});

type Register = z.infer<typeof registerSchema>;
type Login = z.infer<typeof loginSchema>;

type ParsedSuccess<T> = { status: "ok"; data: T };
type ParsedError<T> = { status: "error" } & z.typeToFlattenedError<T>;

export type ParsedResponse<T> = ParsedSuccess<T> | ParsedError<T>;

export type ParsedRegisterError = z.typeToFlattenedError<Register>;
export type ParsedLoginError = z.typeToFlattenedError<Login>;

export type ParsedLoginResponse = ParsedResponse<Login>;
export type ParsedRegisterResponse = ParsedResponse<Register>;

export function validateLoginParams(params: any): ParsedLoginResponse {
  const parsed = loginSchema.safeParse(params);
  if (!parsed.success) {
    return { status: "error", ...parsed.error.flatten() };
  }
  return { status: "ok", data: parsed.data };
}

export function validateRegisterParams(params: any): ParsedRegisterResponse {
  const parsed = registerSchema.safeParse(params);
  if (!parsed.success) {
    return { status: "error", ...parsed.error.flatten() };
  }
  return { status: "ok", data: parsed.data };
}
