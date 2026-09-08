import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { redis } from "../config/redis";
import { env } from "../config/env";

const sessionKey = (id: string) => `session:${id}`;
const blacklistKey = (id: string) => `blacklist:${id}`;
const otpKey = (purpose: string, email: string) => `otp:${purpose}:${email.toLowerCase()}`;

export type StoredSession = {
  userId: string;
  refreshTokenHash: string;
  deviceId: string;
  userAgent: string;
  ip: string;
};

export class SessionService {
  async createSession(
    data: Omit<StoredSession, "refreshTokenHash"> & { refreshToken: string; sessionId?: string }
  ): Promise<string> {
    const sessionId = data.sessionId ?? uuid();
    const payload: StoredSession = {
      userId: data.userId,
      refreshTokenHash: this.hash(data.refreshToken),
      deviceId: data.deviceId,
      userAgent: data.userAgent,
      ip: data.ip
    };
    await redis.set(sessionKey(sessionId), JSON.stringify(payload), "EX", 60 * 60 * 24 * 7);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<StoredSession | null> {
    const raw = await redis.get(sessionKey(sessionId));
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  }

  async rotateRefreshToken(sessionId: string, oldToken: string, newToken: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session || session.refreshTokenHash !== this.hash(oldToken)) {
      throw new Error("Invalid session");
    }
    session.refreshTokenHash = this.hash(newToken);
    await redis.set(sessionKey(sessionId), JSON.stringify(session), "EX", 60 * 60 * 24 * 7);
  }

  async destroySession(sessionId: string): Promise<void> {
    await redis.del(sessionKey(sessionId));
    await redis.set(blacklistKey(sessionId), "1", "EX", 60 * 60 * 24);
  }

  async isAccessBlacklisted(sessionId: string): Promise<boolean> {
    const v = await redis.get(blacklistKey(sessionId));
    return Boolean(v);
  }

  async storeOtp(purpose: string, email: string, hash: string): Promise<void> {
    await redis.set(otpKey(purpose, email), hash, "EX", env.OTP_TTL_SECONDS);
  }

  async verifyOtp(purpose: string, email: string, hash: string): Promise<boolean> {
    const stored = await redis.get(otpKey(purpose, email));
    if (!stored || stored !== hash) return false;
    await redis.del(otpKey(purpose, email));
    return true;
  }

  hash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
}

export const sessionService = new SessionService();
