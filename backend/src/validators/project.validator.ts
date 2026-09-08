import { z } from "zod";
import { ProjectStatus } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const createProjectSchema = z.object({
  projectCode: z.string().min(4),
  title: z.string().min(3),
  description: z.string().min(10),
  mp: objectIdSchema,
  district: z.string(),
  state: z.string(),
  village: z.string(),
  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  budgetSanctioned: z.number().nonnegative(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.coerce.date(),
        budgetAllocated: z.number().nonnegative()
      })
    )
    .optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export const assignContractorSchema = z.object({
  contractorId: objectIdSchema
});

export const milestoneUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"]).optional(),
  completedAt: z.coerce.date().optional(),
  evidenceUrls: z.array(z.string().url()).optional()
});

export const listProjectQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  mp: objectIdSchema.optional(),
  search: z.string().optional()
});
