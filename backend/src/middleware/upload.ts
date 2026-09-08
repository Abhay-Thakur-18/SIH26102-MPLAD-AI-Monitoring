import multer from "multer";
import { ApiError } from "../utils/ApiError";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "audio/mpeg",
  "audio/wav"
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new ApiError(400, "Unsupported file type"));
      return;
    }
    cb(null, true);
  }
});
