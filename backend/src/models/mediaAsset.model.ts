import mongoose, { Schema } from "mongoose";

export interface IMediaAsset {
  publicId: string;
  url: string;
  folder: string;
  mimeType: string;
  bytes: number;
  uploadedBy: mongoose.Types.ObjectId;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    folder: { type: String, required: true },
    mimeType: { type: String, required: true },
    bytes: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    entityType: String,
    entityId: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MediaAssetModel = mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
