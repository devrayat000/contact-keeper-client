import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().max(32).min(8),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(6),
});

export type ParsedResponse<T> = T | z.typeToFlattenedError<T>;
export type ParsedLoginResponse = ParsedResponse<z.infer<typeof loginSchema>>;
export type ParsedRegisterResponse = ParsedResponse<
  z.infer<typeof registerSchema>
>;

export function validateLoginParams(params: any) {
  const parsed = loginSchema.safeParse(params);
  if (!parsed.success) {
    return parsed.error.flatten();
  }
  return parsed.data;
}

export function validateRegisterParams(params: any) {
  const parsed = registerSchema.safeParse(params);
  if (!parsed.success) {
    return parsed.error.flatten();
  }
  return parsed.data;
}
