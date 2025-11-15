import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(12, "Phone number must be at least 8 digits after +216")
    .regex(
      /^\+216\d{8,}$/,
      "Phone number must start with +216 followed by 8 digits"
    ),
  address: z.string().min(10, "Please provide a complete address"),
  reason: z.string().min(5, "Please describe the reason for consultation"),
  message: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
