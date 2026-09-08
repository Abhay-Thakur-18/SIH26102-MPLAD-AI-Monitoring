import { notificationRepository } from "../repositories/notification.repository";
import { NotificationChannel } from "../config/constants";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { emitToUser } from "../sockets/emitter";
import { SocketEvent } from "../config/constants";
import { enqueueEmail } from "../jobs/producers";
import { ApiError } from "../utils/ApiError";

export class NotificationService {
  async create(input: {
    userId: string;
    title: string;
    body: string;
    event: string;
    payload?: Record<string, unknown>;
    channel?: NotificationChannel;
  }) {
    const notification = await notificationRepository.create({
      user: input.userId as never,
      title: input.title,
      body: input.body,
      channel: input.channel ?? NotificationChannel.IN_APP,
      event: input.event,
      payload: input.payload ?? {}
    });
    emitToUser(input.userId, SocketEvent.NOTIFICATION_CREATED, { notification });
    if (input.channel === NotificationChannel.EMAIL) {
      await enqueueEmail({ to: String(input.payload?.email ?? ""), subject: input.title, html: `<p>${input.body}</p>` });
    }
    return notification;
  }

  async list(userId: string, query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const [items, total] = await notificationRepository.findByUser(userId, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async markRead(id: string, userId: string) {
    const item = await notificationRepository.markRead(id, userId);
    if (!item) throw new ApiError(404, "Notification not found");
    return item;
  }

  smsPlaceholder() {
    return { status: "queued_placeholder", channel: NotificationChannel.SMS };
  }

  pushPlaceholder() {
    return { status: "queued_placeholder", channel: NotificationChannel.PUSH };
  }
}

export const notificationService = new NotificationService();
