import { z } from 'zod';

export const userSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    email_verified_at: z.string().nullable().optional(),
    profile_url: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().email("Invalid email address").max(255),
    phone_number: z.string().max(20).nullable().optional(),
});

export const updatePasswordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export const createTierSchema = z.object({
    name: z.string().min(1, "Tier Name is required").max(255, "Tier Name must be less than 255 characters"),
});

export type User = z.infer<typeof userSchema>;
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;
export type CreateTierForm = z.infer<typeof createTierSchema>;
