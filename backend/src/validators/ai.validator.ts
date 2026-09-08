import { z } from "zod";
import { objectIdSchema } from "../middleware/validate";

export const aiPayloadSchema = z.object({
  projectId: objectIdSchema.optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional()
}).passthrough();
