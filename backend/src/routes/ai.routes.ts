import { Router } from "express";
import * as c from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import { aiPayloadSchema } from "../validators/ai.validator";

const router = Router();
router.use(authenticate, requirePermission(Permission.AI_INVOKE));

router.post("/anomaly-detection", validate({ body: aiPayloadSchema }), c.anomalyDetection);
router.post("/risk-prediction", validate({ body: aiPayloadSchema }), c.riskPrediction);
router.post("/duplicate-project", validate({ body: aiPayloadSchema }), c.duplicateProject);
router.post("/image-verification", validate({ body: aiPayloadSchema }), c.imageVerification);
router.post("/audit-report", validate({ body: aiPayloadSchema }), c.auditGeneration);
router.post("/semantic-similarity", validate({ body: aiPayloadSchema }), c.semanticSimilarity);
router.post("/budget-leakage", validate({ body: aiPayloadSchema }), c.budgetLeakage);
router.get("/history/:entityType/:entityId", c.aiHistory);

export default router;
