import { notificationService } from "../services/notification.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const listNotifications = asyncHandler(async (req, res) => {
  const { items, meta } = await notificationService.list(req.authUser!.id, req.query as Record<string, unknown>);
  res.status(200).json(ok("Notifications fetched", items, { ...meta, requestId: req.requestId }));
});

export const readNotification = asyncHandler(async (req, res) => {
  const item = await notificationService.markRead(req.params.id, req.authUser!.id);
  res.status(200).json(ok("Notification read", item, { requestId: req.requestId }));
});

export const smsPlaceholder = asyncHandler(async (req, res) => {
  res.status(200).json(ok("SMS placeholder", notificationService.smsPlaceholder(), { requestId: req.requestId }));
});

export const pushPlaceholder = asyncHandler(async (req, res) => {
  res.status(200).json(ok("Push placeholder", notificationService.pushPlaceholder(), { requestId: req.requestId }));
});
