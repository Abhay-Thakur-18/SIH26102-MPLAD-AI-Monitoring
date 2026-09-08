import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { MediaAssetModel } from "../models/mediaAsset.model";
import { ApiError } from "../utils/ApiError";

const configured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (configured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
}

export const uploadBuffer = async (params: {
  buffer: Buffer;
  folder: string;
  mimeType: string;
  uploadedBy: string;
  entityType?: string;
  entityId?: string;
}) => {
  if (!configured) {
    throw new ApiError(503, "File storage is not configured");
  }
  const dataUri = `data:${params.mimeType};base64,${params.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: `aegis/${params.folder}`, resource_type: "auto" });
  const asset = await MediaAssetModel.create({
    publicId: result.public_id,
    url: result.secure_url,
    folder: params.folder,
    mimeType: params.mimeType,
    bytes: result.bytes,
    uploadedBy: params.uploadedBy as never,
    entityType: params.entityType,
    entityId: params.entityId
  });
  return asset;
};
