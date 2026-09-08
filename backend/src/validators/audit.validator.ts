import { z } from "zod";
import { AuditStatus } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const generateAuditSchema = z.object({
  projectId: objectIdSchema
});

export const assignAuditorSchema = z.object({
  auditorId: objectIdSchema
});

export const auditStatusSchema = z.object({
  status: z.nativeEnum(AuditStatus),
  notes: z.string().optional()
});
