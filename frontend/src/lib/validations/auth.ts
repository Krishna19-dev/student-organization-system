import { z } from "zod";

export const LoginSchema = z.object({
  emailOrId: z
    .string()
    .trim()
    .min(1, "Please provide your campus email or Member ID."),
  password: z
    .string()
    .min(1, "Password is required."),
});

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid campus or personal email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
