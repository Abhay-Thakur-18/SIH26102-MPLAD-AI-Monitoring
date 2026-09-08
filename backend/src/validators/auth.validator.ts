import { z } from "zod";
import { UserRole } from "../config/constants";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  phone: z.string().min(10).max(15).optional(),
  role: z.nativeEnum(UserRole).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  deviceId: z.string().min(3).max(128)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(8),
  password: z.string().min(8).max(72)
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional()
});
