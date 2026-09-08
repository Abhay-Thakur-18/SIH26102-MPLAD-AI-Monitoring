import mongoose, { Schema } from "mongoose";

export interface IActivityLog {
  actor?: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: String,
    ip: String,
    userAgent: String,
    requestId: String,
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ actor: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

ActivityLogSchema.set("strict", true);

export const ActivityLogModel = mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
