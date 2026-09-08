import crypto from "crypto";
import { env } from "../config/env";

export const generateOtp = (): string => {
  const max = 10 ** env.OTP_LENGTH;
  return crypto.randomInt(0, max).toString().padStart(env.OTP_LENGTH, "0");
};

export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
