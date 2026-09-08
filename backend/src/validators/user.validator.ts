import { z } from "zod";
import { USER_ROLES, UserStatus } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(USER_ROLES as [string, ...string[]]),
  phone: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  mpCode: z.string().optional()
});

export const listUserQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  role: z.enum(USER_ROLES as [string, ...string[]]).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  district: z.string().optional(),
  search: z.string().optional()
});

export const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  organization: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().url().optional()
});

export const verifyUserSchema = z.object({
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  kycVerified: z.boolean().optional()
});

export const bulkImportSchema = z.object({
  users: z.array(createUserSchema).min(1).max(500)
});

export const idParam = z.object({ id: objectIdSchema });
