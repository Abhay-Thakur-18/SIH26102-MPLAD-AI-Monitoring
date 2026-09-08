import { contractorService } from "../services/contractor.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createContractor = asyncHandler(async (req, res) => {
  const item = await contractorService.create(req.body);
  res.status(201).json(ok("Contractor created", item, { requestId: req.requestId }));
});

export const listContractors = asyncHandler(async (req, res) => {
  const { items, meta } = await contractorService.list(req.query as Record<string, unknown>);
  res.status(200).json(ok("Contractors fetched", items, { ...meta, requestId: req.requestId }));
});

export const getContractor = asyncHandler(async (req, res) => {
  const item = await contractorService.getById(req.params.id);
  res.status(200).json(ok("Contractor fetched", item, { requestId: req.requestId }));
});

export const updateContractor = asyncHandler(async (req, res) => {
  const item = await contractorService.update(req.params.id, req.body);
  res.status(200).json(ok("Contractor updated", item, { requestId: req.requestId }));
});
