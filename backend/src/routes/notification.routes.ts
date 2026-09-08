import { Router } from "express";
import * as c from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";
import { requireObjectId } from "../middleware/objectId";

const router = Router();
router.use(authenticate, requirePermission(Permission.NOTIFICATIONS_READ));

router.get("/", c.listNotifications);
router.patch("/:id/read", requireObjectId(), c.readNotification);
router.post("/sms-placeholder", c.smsPlaceholder);
router.post("/push-placeholder", c.pushPlaceholder);

export default router;
