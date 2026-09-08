import { z } from "zod";
import { RiskLevel } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const createContractorSchema = z.object({
  user: objectIdSchema.optional(),
  organization: z.string().min(2),
  pan: z.string().min(10).max(10),
  gst: z.string().min(15).max(15),
  district: z.string(),
  state: z.string()
});

export const updateContractorSchema = z.object({
  integrityScore: z.number().min(0).max(100).optional(),
  performanceScore: z.number().min(0).max(100).optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional()
});
