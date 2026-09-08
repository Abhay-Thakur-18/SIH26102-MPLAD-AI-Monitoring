import mongoose, { Schema } from "mongoose";
import { NotificationChannel } from "../config/constants";

export interface INotification {
  user: mongoose.Types.ObjectId;
  title: string;
  body: string;
  channel: NotificationChannel;
  event: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    channel: { type: String, enum: Object.values(NotificationChannel), default: NotificationChannel.IN_APP },
    event: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
    readAt: Date
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
