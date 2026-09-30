import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const roleSchema = z.enum(["Java Developer", "SDE", "Full Stack Developer"]);
export const experienceSchema = z.enum(["Fresher", "0–1 Year", "1–3 Years"]);
export const difficultySchema = z.enum(["Easy", "Medium", "Hard"]);
export const interviewTypeSchema = z.enum(["Technical", "DSA", "Mixed"]);

export const interviewConfigSchema = z.object({
  role: roleSchema,
  experience: experienceSchema,
  difficulty: difficultySchema,
  type: interviewTypeSchema,
  questionCount: z.number().int().min(1).max(15),
  duration: z.coerce.number().int().min(15).max(45),
});
