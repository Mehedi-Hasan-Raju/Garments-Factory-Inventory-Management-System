
import { z } from "zod";

export const registerSchema = z.object({
  organizationName: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
