import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register({ ...req.body, actorRole: req.authUser?.role });
  res.status(201).json(ok("Registration successful. Verify email OTP.", user, { requestId: req.requestId }));
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login({
    ...req.body,
    ip: req.ip || "",
    userAgent: req.get("user-agent") || "unknown"
  });
  res.status(200).json(ok("Login successful", data, { requestId: req.requestId }));
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken);
  res.status(200).json(ok("Token rotated", data, { requestId: req.requestId }));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.authUser) await authService.logout(req.authUser.sessionId);
  res.status(200).json(ok("Logged out", null, { requestId: req.requestId }));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body.email, req.body.otp);
  res.status(200).json(ok("Email verified", user, { requestId: req.requestId }));
});

export const resendOtp = asyncHandler(async (req, res) => {
  await authService.sendEmailOtp(req.body.email);
  res.status(200).json(ok("OTP sent", null, { requestId: req.requestId }));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json(ok("If the account exists, an OTP has been sent", null, { requestId: req.requestId }));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.email, req.body.otp, req.body.password);
  res.status(200).json(ok("Password reset successful", null, { requestId: req.requestId }));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(ok("Profile", req.authUser, { requestId: req.requestId }));
});
