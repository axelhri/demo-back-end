import { z } from "zod";

const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Doit avoir au minimum 3 caractères" })
    .max(15, { message: "Doit avoir au maximum 15 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Doit avoir au minimum 6 caractères" }),
  profileImage: z
    .string()
    .url({ message: "Image invalide, doit être une URL valide" }) // Valide une URL pour l'image
    .optional(), // Si vous voulez que l'image soit facultative, sinon enlevez `.optional()`
  bio: z.string().trim(),
});

const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().trim(),
});

const UpdateUserSchema = RegisterUserSchema.partial();

export { LoginUserSchema, RegisterUserSchema, UpdateUserSchema };
