import { Router } from "express";
import * as c from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  listUserQuery,
  profileUpdateSchema,
  verifyUserSchema,
  bulkImportSchema,
  idParam
} from "../validators/user.validator";
import { requireObjectId } from "../middleware/objectId";
import { auditLog } from "../middleware/auditLog";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission(Permission.USERS_READ), validate({ query: listUserQuery }), c.listUsers);
router.post("/", requirePermission(Permission.USERS_CREATE), validate({ body: createUserSchema }), auditLog("users.create", "user"), c.createUser);
router.post("/import", requirePermission(Permission.USERS_IMPORT), validate({ body: bulkImportSchema }), c.bulkImportUsers);
router.get("/me", c.getCurrentUser);
router.patch("/me", validate({ body: profileUpdateSchema }), c.updateProfile);
router.get("/:id", requirePermission(Permission.USERS_READ), requireObjectId(), validate({ params: idParam }), c.getUser);
router.patch("/:id", requirePermission(Permission.USERS_UPDATE), requireObjectId(), validate({ params: idParam, body: profileUpdateSchema }), c.updateProfile);
router.patch("/:id/verify", requirePermission(Permission.USERS_VERIFY), requireObjectId(), validate({ params: idParam, body: verifyUserSchema }), c.verifyUser);
router.delete("/:id", requirePermission(Permission.USERS_DELETE), requireObjectId(), c.deleteUser);
router.post("/:id/restore", requirePermission(Permission.USERS_DELETE), requireObjectId(), c.restoreUser);

export default router;
