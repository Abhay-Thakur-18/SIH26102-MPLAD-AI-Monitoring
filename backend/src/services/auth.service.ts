import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { env } from "../config/env";
import { UserRole, UserStatus } from "../config/constants";
import { ROLE_PERMISSIONS } from "../config/permissions";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { generateOtp, hashOtp } from "../utils/otp";
import { sendMail } from "../utils/mailer";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens";
import { sessionService } from "./session.service";
import { logger, securityLogger } from "../config/logger";

export class AuthService {
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    actorRole?: UserRole;
  }) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ApiError(409, "Email already registered");

    const requestedRole = input.role ?? UserRole.CITIZEN;
    if (requestedRole !== UserRole.CITIZEN && input.actorRole !== UserRole.SUPER_ADMIN && input.actorRole !== UserRole.ADMIN) {
      throw new ApiError(403, "Cannot self-assign privileged role");
    }

    const password = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const user = await userRepository.create({
      email: input.email.toLowerCase(),
      password,
      role: requestedRole,
      profile: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone
      },
      verification: { emailVerified: false, phoneVerified: false, kycVerified: false },
      permissions: ROLE_PERMISSIONS[requestedRole],
      status: UserStatus.PENDING_VERIFICATION,
      deviceHistory: []
    });

    await this.sendEmailOtp(user.email);
    return this.toSafeUser(user);
  }

  async sendEmailOtp(email: string) {
    const otp = generateOtp();
    await sessionService.storeOtp("email", email, hashOtp(otp));
    await sendMail(
      email,
      "AEGIS email verification",
      `<p>Your OTP is <strong>${otp}</strong>. It expires in ${env.OTP_TTL_SECONDS / 60} minutes.</p>`
    );
    logger.info("OTP issued", { email, purpose: "email" });
  }

  async verifyEmail(email: string, otp: string) {
    const ok = await sessionService.verifyOtp("email", email, hashOtp(otp));
    if (!ok) throw new ApiError(400, "Invalid or expired OTP");
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");
    user.verification.emailVerified = true;
    user.verification.emailVerifiedAt = new Date();
    user.status = UserStatus.ACTIVE;
    await user.save();
    return this.toSafeUser(user);
  }

  async login(input: { email: string; password: string; deviceId: string; ip: string; userAgent: string }) {
    const user = await userRepository.findByEmail(input.email, true);
    if (!user) throw new ApiError(401, "Invalid credentials");
    const match = await bcrypt.compare(input.password, user.password);
    if (!match) {
      securityLogger.warn("Failed login", { email: input.email, ip: input.ip });
      throw new ApiError(401, "Invalid credentials");
    }
    if (user.status === UserStatus.SUSPENDED) throw new ApiError(403, "Account suspended");
    if (user.status === UserStatus.PENDING_VERIFICATION) throw new ApiError(403, "Email not verified");

    const sessionId = uuid();
    const accessToken = signAccessToken({ sub: user.id, role: user.role, sessionId });
    const refreshToken = signRefreshToken({ sub: user.id, sessionId });
    await sessionService.createSession({
      sessionId,
      userId: user.id,
      refreshToken,
      deviceId: input.deviceId,
      userAgent: input.userAgent,
      ip: input.ip
    });

    user.lastLoginAt = new Date();
    user.lastLoginIp = input.ip;
    const existingDevice = user.deviceHistory.find((d) => d.deviceId === input.deviceId);
    if (existingDevice) {
      existingDevice.lastUsedAt = new Date();
      existingDevice.ip = input.ip;
      existingDevice.userAgent = input.userAgent;
    } else {
      user.deviceHistory.push({
        deviceId: input.deviceId,
        userAgent: input.userAgent,
        ip: input.ip,
        lastUsedAt: new Date()
      });
    }
    await user.save();

    return {
      user: this.toSafeUser(user),
      tokens: { accessToken, refreshToken, expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== "refresh") throw new ApiError(401, "Invalid token");
    const session = await sessionService.getSession(payload.sessionId);
    if (!session || session.userId !== payload.sub || session.refreshTokenHash !== sessionService.hash(refreshToken)) {
      throw new ApiError(401, "Session expired");
    }
    const user = await userRepository.findById(payload.sub);
    if (!user || user.status !== UserStatus.ACTIVE) throw new ApiError(401, "Unauthorized");
    const newRefresh = signRefreshToken({ sub: user.id, sessionId: payload.sessionId });
    const newAccess = signAccessToken({ sub: user.id, role: user.role, sessionId: payload.sessionId });
    await sessionService.rotateRefreshToken(payload.sessionId, refreshToken, newRefresh);
    return { accessToken: newAccess, refreshToken: newRefresh, expiresIn: env.JWT_ACCESS_EXPIRES_IN };
  }

  async logout(sessionId: string) {
    await sessionService.destroySession(sessionId);
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;
    const otp = generateOtp();
    await sessionService.storeOtp("reset", email, hashOtp(otp));
    await sendMail(email, "AEGIS password reset", `<p>Your reset OTP is <strong>${otp}</strong>.</p>`);
  }

  async resetPassword(email: string, otp: string, password: string) {
    const ok = await sessionService.verifyOtp("reset", email, hashOtp(otp));
    if (!ok) throw new ApiError(400, "Invalid or expired OTP");
    const user = await userRepository.findByEmail(email, true);
    if (!user) throw new ApiError(404, "User not found");
    user.password = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    await user.save();
  }

  toSafeUser(user: any) {
    const obj = typeof user?.toObject === "function" ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
  }
}

export const authService = new AuthService();
