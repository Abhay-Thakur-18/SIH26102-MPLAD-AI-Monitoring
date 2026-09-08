import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/auth.validator";
import { authenticate } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import { auditLog } from "../middleware/auditLog";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a citizen account
 */
router.post("/register", authRateLimiter, validate({ body: registerSchema }), auditLog("auth.register", "user"), authController.register);
router.post("/login", authRateLimiter, validate({ body: loginSchema }), auditLog("auth.login", "user"), authController.login);
router.post("/refresh", authRateLimiter, validate({ body: refreshSchema }), authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.post("/verify-email", validate({ body: verifyEmailSchema }), authController.verifyEmail);
router.post("/resend-otp", authRateLimiter, validate({ body: forgotPasswordSchema }), authController.resendOtp);
router.post("/forgot-password", authRateLimiter, validate({ body: forgotPasswordSchema }), authController.forgotPassword);
router.post("/reset-password", validate({ body: resetPasswordSchema }), authController.resetPassword);
router.get("/me", authenticate, authController.me);

export default router;
