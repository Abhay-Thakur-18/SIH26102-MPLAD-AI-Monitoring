import { Queue } from "bullmq";
import { redis } from "../config/redis";
import { QueueName } from "../config/constants";

const connection = redis;

export const imageQueue = new Queue(QueueName.IMAGE_PROCESSING, { connection });
export const aiQueue = new Queue(QueueName.AI_PREDICTION, { connection });
export const pdfQueue = new Queue(QueueName.PDF_GENERATION, { connection });
export const emailQueue = new Queue(QueueName.EMAIL, { connection });
export const riskQueue = new Queue(QueueName.RISK_RECALCULATION, { connection });
export const analyticsQueue = new Queue(QueueName.DAILY_ANALYTICS, { connection });

export const enqueuePdfGeneration = (data: { auditId: string }) => pdfQueue.add("generate", data, { attempts: 3, backoff: { type: "exponential", delay: 2000 } });
export const enqueueAiPrediction = (data: Record<string, unknown>) =>
  aiQueue.add("predict", data, { attempts: 3, backoff: { type: "exponential", delay: 2000 } });
export const enqueueEmail = (data: { to: string; subject: string; html: string }) =>
  emailQueue.add("send", data, { attempts: 5, backoff: { type: "exponential", delay: 1000 } });
export const enqueueImageProcessing = (data: { projectId: string; url: string }) =>
  imageQueue.add("process", data, { attempts: 3 });
export const enqueueRiskRecalc = (data: { projectId: string }) =>
  riskQueue.add("recalculate", data, { attempts: 3 });
