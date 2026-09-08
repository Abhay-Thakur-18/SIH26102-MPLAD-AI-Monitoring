import { aiGatewayService } from "../ai/aiGateway.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { emitEvent } from "../sockets/emitter";
import { SocketEvent } from "../config/constants";

export const anomalyDetection = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("fraud", req.body, { type: req.body.entityType, id: req.body.entityId });
  if (data.riskScore >= 70) emitEvent(SocketEvent.RISK_DETECTED, data);
  res.status(200).json(ok("Anomaly detection complete", data, { requestId: req.requestId }));
});

export const riskPrediction = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("risk", req.body, { type: "project", id: req.body.projectId });
  res.status(200).json(ok("Risk prediction complete", data, { requestId: req.requestId }));
});

export const duplicateProject = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("duplicate", req.body, { type: "project", id: req.body.projectId });
  res.status(200).json(ok("Duplicate detection complete", data, { requestId: req.requestId }));
});

export const imageVerification = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("image", req.body, { type: "project", id: req.body.projectId });
  res.status(200).json(ok("Image verification complete", data, { requestId: req.requestId }));
});

export const auditGeneration = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("audit", req.body, { type: "project", id: req.body.projectId });
  res.status(200).json(ok("Audit AI complete", data, { requestId: req.requestId }));
});

export const semanticSimilarity = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("semantic", req.body);
  res.status(200).json(ok("Semantic similarity complete", data, { requestId: req.requestId }));
});

export const budgetLeakage = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.invoke("leakage", req.body, { type: "project", id: req.body.projectId });
  res.status(200).json(ok("Budget leakage prediction complete", data, { requestId: req.requestId }));
});

export const aiHistory = asyncHandler(async (req, res) => {
  const data = await aiGatewayService.history(req.params.entityType, req.params.entityId);
  res.status(200).json(ok("AI history", data, { requestId: req.requestId }));
});
