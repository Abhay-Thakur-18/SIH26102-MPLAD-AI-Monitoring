import { Router } from "express";
import * as c from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import { createPaymentSchema, updatePaymentSchema } from "../validators/payment.validator";
import { requireObjectId } from "../middleware/objectId";
import { upload } from "../middleware/upload";

const router = Router();
router.use(authenticate);

router.get("/", requirePermission(Permission.PAYMENTS_READ), c.listPayments);
router.post("/", requirePermission(Permission.PAYMENTS_CREATE), validate({ body: createPaymentSchema }), c.createPayment);
router.get("/budget/:projectId", requirePermission(Permission.PAYMENTS_READ), requireObjectId("projectId"), c.budgetSummary);
router.get("/:id", requirePermission(Permission.PAYMENTS_READ), requireObjectId(), c.getPayment);
router.patch("/:id", requirePermission(Permission.PAYMENTS_UPDATE), requireObjectId(), validate({ body: updatePaymentSchema }), c.updatePayment);
router.post("/:id/:kind", requirePermission(Permission.PAYMENTS_UPDATE), requireObjectId(), upload.single("file"), c.uploadPaymentFile);

export default router;
