import { env } from "../config/env";
import { aiLogger } from "../config/logger";
import { aiResultRepository } from "../repositories/aiResult.repository";
import { ApiError } from "../utils/ApiError";
import { newRequestId } from "../utils/ApiResponse";

export type AiStandardResponse = {
  requestId: string;
  modelName: string;
  confidence: number;
  riskScore: number;
  status: string;
  prediction: Record<string, unknown>;
  explanation: string;
  metadata: Record<string, unknown>;
  timestamp: string;
};

const endpoints = {
  risk: "/v1/risk-prediction",
  fraud: "/v1/fraud-detection",
  duplicate: "/v1/duplicate-project",
  image: "/v1/image-verification",
  audit: "/v1/audit-report",
  semantic: "/v1/semantic-similarity",
  leakage: "/v1/budget-leakage"
} as const;

export class AiGatewayService {
  async invoke(
    kind: keyof typeof endpoints,
    payload: Record<string, unknown>,
    entity?: { type: string; id?: string }
  ): Promise<AiStandardResponse> {
    const requestId = newRequestId();
    const url = `${env.AI_SERVICE_URL}${endpoints[kind]}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), env.AI_SERVICE_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": env.INTERNAL_API_KEY,
          "x-request-id": requestId
        },
        body: JSON.stringify({ ...payload, requestId }),
        signal: controller.signal
      });
      if (!res.ok) throw new ApiError(502, "AI service error");
      const data = (await res.json()) as AiStandardResponse;
      await aiResultRepository.create({
        requestId: data.requestId ?? requestId,
        modelName: data.modelName,
        confidence: data.confidence,
        riskScore: data.riskScore,
        status: data.status,
        prediction: data.prediction,
        explanation: data.explanation,
        metadata: data.metadata ?? {},
        entityType: entity?.type ?? "generic",
        entityId: entity?.id
      });
      aiLogger.info("AI prediction stored", { requestId: data.requestId, modelName: data.modelName });
      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      aiLogger.error("AI gateway failure", { error: err instanceof Error ? err.message : err, requestId });
      throw new ApiError(502, "AI service unavailable");
    } finally {
      clearTimeout(timer);
    }
  }

  history(entityType: string, entityId: string) {
    return aiResultRepository.listByEntity(entityType, entityId);
  }
}

export const aiGatewayService = new AiGatewayService();
