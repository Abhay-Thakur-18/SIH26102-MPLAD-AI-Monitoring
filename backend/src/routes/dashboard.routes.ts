import { Router } from "express";
import * as c from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { Permission } from "../config/permissions";

const router = Router();
router.use(authenticate, requirePermission(Permission.DASHBOARD_READ));

router.get("/summary", c.summary);
router.get("/risk-heatmap", c.riskHeatmap);
router.get("/fraud-summary", c.fraudSummary);
router.get("/integrity-ranking", c.integrityRanking);
router.get("/district/:district", c.districtAnalytics);
router.get("/mp/:mpId", c.mpAnalytics);
router.get("/state/:state", c.stateAnalytics);

export default router;
