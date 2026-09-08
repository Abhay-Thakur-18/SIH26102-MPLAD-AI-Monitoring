import { NotificationModel, INotification } from "../models/notification.model";

export class NotificationRepository {
  create(data: Partial<INotification>) {
    return NotificationModel.create(data);
  }

  findByUser(userId: string, skip: number, limit: number) {
    return Promise.all([
      NotificationModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NotificationModel.countDocuments({ user: userId })
    ]);
  }

  markRead(id: string, userId: string) {
    return NotificationModel.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }
}

export const notificationRepository = new NotificationRepository();
