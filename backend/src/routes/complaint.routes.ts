import { Router } from "express";
import * as c from "../controllers/complaint.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import { createComplaintSchema, complaintStatusSchema } from "../validators/complaint.validator";
import { requireObjectId } from "../middleware/objectId";
import { upload } from "../middleware/upload";

const router = Router();
router.use(authenticate);

router.post("/", requirePermission(Permission.COMPLAINTS_CREATE), validate({ body: createComplaintSchema }), c.createComplaint);
router.get("/", requirePermission(Permission.COMPLAINTS_READ), c.listComplaints);
router.get("/:id", requireObjectId(), c.getComplaint);
router.patch("/:id", requirePermission(Permission.COMPLAINTS_UPDATE), requireObjectId(), validate({ body: complaintStatusSchema }), c.updateComplaint);
router.post("/:id/media", requirePermission(Permission.COMPLAINTS_CREATE), requireObjectId(), upload.array("files", 8), c.uploadComplaintMedia);

export default router;
