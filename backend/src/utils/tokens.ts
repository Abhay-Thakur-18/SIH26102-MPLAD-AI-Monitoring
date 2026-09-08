import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../config/constants";

export type AccessPayload = {
  sub: string;
  role: UserRole;
  sessionId: string;
  type: "access";
};

export type RefreshPayload = {
  sub: string;
  sessionId: string;
  type: "refresh";
};

export const signAccessToken = (payload: Omit<AccessPayload, "type">): string => {
  return jwt.sign({ ...payload, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  });
};

export const signRefreshToken = (payload: Omit<RefreshPayload, "type">): string => {
  return jwt.sign({ ...payload, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  });
};

export const verifyAccessToken = (token: string): AccessPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
};
