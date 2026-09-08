import { paymentService } from "../services/payment.service";
import { uploadBuffer } from "../config/cloudinary";
import { MediaFolder, SocketEvent } from "../config/constants";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { emitEvent } from "../sockets/emitter";

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.create(req.body, req.authUser!.id);
  emitEvent(SocketEvent.PAYMENT_STATUS_UPDATED, { paymentId: payment.id, status: payment.status });
  res.status(201).json(ok("Payment recorded", payment, { requestId: req.requestId }));
});

export const listPayments = asyncHandler(async (req, res) => {
  const { items, meta } = await paymentService.list(req.query as Record<string, unknown>);
  res.status(200).json(ok("Payments fetched", items, { ...meta, requestId: req.requestId }));
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getById(req.params.id);
  res.status(200).json(ok("Payment fetched", payment, { requestId: req.requestId }));
});

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.updateStatus(req.params.id, req.body.status);
  emitEvent(SocketEvent.PAYMENT_STATUS_UPDATED, { paymentId: payment.id, status: payment.status });
  res.status(200).json(ok("Payment updated", payment, { requestId: req.requestId }));
});

export const uploadPaymentFile = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, message: "File required" });
    return;
  }
  const asset = await uploadBuffer({
    buffer: file.buffer,
    folder: MediaFolder.PROJECTS,
    mimeType: file.mimetype,
    uploadedBy: req.authUser!.id,
    entityType: "payment",
    entityId: req.params.id
  });
  const payment = await paymentService.attachMedia(req.params.id, req.params.kind as "invoice" | "receipt", asset.url);
  res.status(201).json(ok("File attached", payment, { requestId: req.requestId }));
});

export const budgetSummary = asyncHandler(async (req, res) => {
  const data = await paymentService.budgetSummary(req.params.projectId);
  res.status(200).json(ok("Budget summary", data, { requestId: req.requestId }));
});
