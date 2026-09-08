import { complaintService } from "../services/complaint.service";
import { uploadBuffer } from "../config/cloudinary";
import { MediaFolder } from "../config/constants";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createComplaint = asyncHandler(async (req, res) => {
  const item = await complaintService.submit(req.body, req.authUser!.id);
  res.status(201).json(ok("Complaint submitted", item, { requestId: req.requestId }));
});

export const listComplaints = asyncHandler(async (req, res) => {
  const { items, meta } = await complaintService.list(req.query as Record<string, unknown>);
  res.status(200).json(ok("Complaints fetched", items, { ...meta, requestId: req.requestId }));
});

export const getComplaint = asyncHandler(async (req, res) => {
  const item = await complaintService.getById(req.params.id);
  res.status(200).json(ok("Complaint fetched", item, { requestId: req.requestId }));
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const item = await complaintService.updateStatus(req.params.id, req.body.status);
  res.status(200).json(ok("Complaint updated", item, { requestId: req.requestId }));
});

export const uploadComplaintMedia = asyncHandler(async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const urls = [];
  for (const file of files) {
    const asset = await uploadBuffer({
      buffer: file.buffer,
      folder: MediaFolder.COMPLAINTS,
      mimeType: file.mimetype,
      uploadedBy: req.authUser!.id,
      entityType: "complaint",
      entityId: req.params.id
    });
    urls.push(asset.url);
  }
  res.status(201).json(ok("Media uploaded", { urls }, { requestId: req.requestId }));
});
