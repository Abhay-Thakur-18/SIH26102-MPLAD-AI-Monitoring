import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import paymentRoutes from "./payment.routes";
import aiRoutes from "./ai.routes";
import auditRoutes from "./audit.routes";
import complaintRoutes from "./complaint.routes";
import notificationRoutes from "./notification.routes";
import dashboardRoutes from "./dashboard.routes";
import contractorRoutes from "./contractor.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/payments", paymentRoutes);
router.use("/ai", aiRoutes);
router.use("/audit", auditRoutes);
router.use("/complaints", complaintRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contractors", contractorRoutes);

export default router;
