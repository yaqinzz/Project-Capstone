import z from "zod";
import { emailSchema, passwordSchema } from "~/schemas/auth";

export const registerFormScema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormSchema = z.infer<typeof registerFormScema>;
