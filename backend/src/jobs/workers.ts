import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { QueueName } from "../config/constants";
import { logger } from "../config/logger";
import { sendMail } from "../utils/mailer";
import { auditRepository } from "../repositories/audit.repository";
import { aiGatewayService } from "../ai/aiGateway.service";
import { projectRepository } from "../repositories/project.repository";

const connection = redis;

export const startWorkers = (): void => {
  new Worker(
    QueueName.EMAIL,
    async (job) => {
      await sendMail(job.data.to, job.data.subject, job.data.html);
    },
    { connection }
  );

  new Worker(
    QueueName.PDF_GENERATION,
    async (job) => {
      const report = await auditRepository.findById(job.data.auditId);
      if (!report) return;
      report.pdfUrl = `generated://audit/${report.id}.pdf`;
      await report.save();
    },
    { connection }
  );

  new Worker(
    QueueName.AI_PREDICTION,
    async (job) => {
      await aiGatewayService.invoke(job.data.kind, job.data.payload, job.data.entity);
    },
    { connection }
  );

  new Worker(
    QueueName.IMAGE_PROCESSING,
    async (job) => {
      logger.info("Image processing job", job.data);
    },
    { connection }
  );

  new Worker(
    QueueName.RISK_RECALCULATION,
    async (job) => {
      const result = await aiGatewayService.invoke("risk", { projectId: job.data.projectId }, { type: "project", id: job.data.projectId });
      await projectRepository.updateById(job.data.projectId, { riskScore: result.riskScore });
    },
    { connection }
  );

  new Worker(
    QueueName.DAILY_ANALYTICS,
    async () => {
      logger.info("Daily analytics job completed");
    },
    { connection }
  );

  logger.info("BullMQ workers started");
};
