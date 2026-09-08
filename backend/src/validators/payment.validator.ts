import { z } from "zod";
import { PaymentStage, PaymentStatus } from "../config/constants";
import { objectIdSchema } from "../middleware/validate";

export const createPaymentSchema = z.object({
  pfmsTransactionId: z.string().min(6),
  project: objectIdSchema,
  vendor: objectIdSchema,
  amount: z.number().positive(),
  paymentStage: z.nativeEnum(PaymentStage),
  notes: z.string().optional()
});

export const updatePaymentSchema = z.object({
  status: z.nativeEnum(PaymentStatus)
});
