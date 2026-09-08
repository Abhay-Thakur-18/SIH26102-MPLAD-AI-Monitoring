import nodemailer from "nodemailer";
import { env, isProduction } from "../config/env";
import { logger } from "../config/logger";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
});

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  if (!env.SMTP_USER) {
    logger.info("Email skipped (SMTP not configured)", { to, subject, html });
    return;
  }
  await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
  if (isProduction) logger.info("Email sent", { to, subject });
};
