import { auditService } from "../services/audit.service";
import { uploadBuffer } from "../config/cloudinary";
import { MediaFolder, SocketEvent } from "../config/constants";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { emitEvent } from "../sockets/emitter";

export const generateAudit = asyncHandler(async (req, res) => {
  const data = await auditService.generate(req.body.projectId, req.authUser!.id);
  res.status(201).json(ok("Audit generated", data, { requestId: req.requestId }));
});

export const listAudits = asyncHandler(async (req, res) => {
  const { items, meta } = await auditService.list(req.query as Record<string, unknown>);
  res.status(200).json(ok("Audit reports fetched", items, { ...meta, requestId: req.requestId }));
});

export const getAudit = asyncHandler(async (req, res) => {
  const item = await auditService.getById(req.params.id);
  res.status(200).json(ok("Audit report fetched", item, { requestId: req.requestId }));
});

export const assignAuditor = asyncHandler(async (req, res) => {
  const item = await auditService.assign(req.params.id, req.body.auditorId);
  res.status(200).json(ok("Auditor assigned", item, { requestId: req.requestId }));
});

export const addEvidence = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, message: "File required" });
    return;
  }
  const asset = await uploadBuffer({
    buffer: file.buffer,
    folder: MediaFolder.AUDIT,
    mimeType: file.mimetype,
    uploadedBy: req.authUser!.id,
    entityType: "audit",
    entityId: req.params.id
  });
  const item = await auditService.addEvidence(req.params.id, { url: asset.url, type: file.mimetype, caption: req.body.caption });
  res.status(201).json(ok("Evidence added", item, { requestId: req.requestId }));
});

export const updateAuditStatus = asyncHandler(async (req, res) => {
  const item = await auditService.updateStatus(req.params.id, req.body.status, req.body.notes);
  if (req.body.status === "COMPLETED") emitEvent(SocketEvent.AUDIT_COMPLETED, { auditId: item.id });
  res.status(200).json(ok("Audit status updated", item, { requestId: req.requestId }));
});
