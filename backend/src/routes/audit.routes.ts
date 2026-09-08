import { Router } from "express";
import * as c from "../controllers/audit.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import { generateAuditSchema, assignAuditorSchema, auditStatusSchema } from "../validators/audit.validator";
import { requireObjectId } from "../middleware/objectId";
import { upload } from "../middleware/upload";

const router = Router();
router.use(authenticate);

router.get("/", requirePermission(Permission.AUDIT_READ), c.listAudits);
router.post("/generate", requirePermission(Permission.AUDIT_GENERATE), validate({ body: generateAuditSchema }), c.generateAudit);
router.get("/:id", requirePermission(Permission.AUDIT_READ), requireObjectId(), c.getAudit);
router.post("/:id/assign", requirePermission(Permission.AUDIT_ASSIGN), requireObjectId(), validate({ body: assignAuditorSchema }), c.assignAuditor);
router.post("/:id/evidence", requirePermission(Permission.AUDIT_GENERATE), requireObjectId(), upload.single("file"), c.addEvidence);
router.patch("/:id/status", requirePermission(Permission.AUDIT_ASSIGN), requireObjectId(), validate({ body: auditStatusSchema }), c.updateAuditStatus);

export default router;
