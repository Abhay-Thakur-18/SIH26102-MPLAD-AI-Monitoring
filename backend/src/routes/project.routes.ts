import { Router } from "express";
import * as c from "../controllers/project.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  assignContractorSchema,
  milestoneUpdateSchema,
  listProjectQuery
} from "../validators/project.validator";
import { requireObjectId } from "../middleware/objectId";
import { upload } from "../middleware/upload";
import { auditLog } from "../middleware/auditLog";

const router = Router();
router.use(authenticate);

router.get("/", validate({ query: listProjectQuery }), c.listProjects);
router.get("/export", requirePermission(Permission.PROJECTS_EXPORT), c.exportProjects);
router.post("/", requirePermission(Permission.PROJECTS_CREATE), validate({ body: createProjectSchema }), auditLog("projects.create", "project"), c.createProject);
router.get("/:id", requireObjectId(), c.getProject);
router.get("/:id/risk", requireObjectId(), c.getProjectRisk);
router.patch("/:id", requirePermission(Permission.PROJECTS_UPDATE), requireObjectId(), validate({ body: updateProjectSchema }), c.updateProject);
router.post("/:id/assign-contractor", requirePermission(Permission.PROJECTS_ASSIGN), requireObjectId(), validate({ body: assignContractorSchema }), c.assignContractor);
router.patch("/:id/milestones/:milestoneId", requirePermission(Permission.MILESTONES_UPDATE), requireObjectId(), validate({ body: milestoneUpdateSchema }), c.updateMilestone);
router.post("/:id/images", requirePermission(Permission.MILESTONES_UPDATE), requireObjectId(), upload.single("file"), c.uploadProjectImage);
router.delete("/:id", requirePermission(Permission.PROJECTS_DELETE), requireObjectId(), c.deleteProject);

export default router;
