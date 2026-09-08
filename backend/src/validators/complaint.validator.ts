import { z } from "zod";
import { ComplaintStatus } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const createComplaintSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  project: objectIdSchema.optional(),
  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.number(), z.number()])
  })
});

export const complaintStatusSchema = z.object({
  status: z.nativeEnum(ComplaintStatus)
});
