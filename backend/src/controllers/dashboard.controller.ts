import { dashboardService } from "../services/dashboard.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.summary();
  res.status(200).json(ok("Dashboard summary", data, { requestId: req.requestId }));
});

export const riskHeatmap = asyncHandler(async (req, res) => {
  const data = await dashboardService.riskHeatmap();
  res.status(200).json(ok("Risk heatmap", data, { requestId: req.requestId }));
});

export const fraudSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.fraudSummary();
  res.status(200).json(ok("Fraud summary", data, { requestId: req.requestId }));
});

export const integrityRanking = asyncHandler(async (req, res) => {
  const data = await dashboardService.integrityRanking();
  res.status(200).json(ok("Integrity ranking", data, { requestId: req.requestId }));
});

export const districtAnalytics = asyncHandler(async (req, res) => {
  const data = await dashboardService.districtAnalytics(req.params.district);
  res.status(200).json(ok("District analytics", data, { requestId: req.requestId }));
});

export const mpAnalytics = asyncHandler(async (req, res) => {
  const data = await dashboardService.mpAnalytics(req.params.mpId);
  res.status(200).json(ok("MP analytics", data, { requestId: req.requestId }));
});

export const stateAnalytics = asyncHandler(async (req, res) => {
  const data = await dashboardService.stateAnalytics(req.params.state);
  res.status(200).json(ok("State analytics", data, { requestId: req.requestId }));
});
