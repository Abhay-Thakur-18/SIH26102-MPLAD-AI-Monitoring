import { Router } from "express";
import * as c from "../controllers/contractor.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import { createContractorSchema, updateContractorSchema } from "../validators/contractor.validator";
import { requireObjectId } from "../middleware/objectId";

const router = Router();
router.use(authenticate);

router.get("/", requirePermission(Permission.CONTRACTORS_READ), c.listContractors);
router.post("/", requirePermission(Permission.CONTRACTORS_UPDATE), validate({ body: createContractorSchema }), c.createContractor);
router.get("/:id", requirePermission(Permission.CONTRACTORS_READ), requireObjectId(), c.getContractor);
router.patch("/:id", requirePermission(Permission.CONTRACTORS_UPDATE), requireObjectId(), validate({ body: updateContractorSchema }), c.updateContractor);

export default router;
