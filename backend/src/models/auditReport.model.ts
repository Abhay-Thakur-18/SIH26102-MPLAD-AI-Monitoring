import mongoose, { Schema } from "mongoose";
import { AuditStatus } from "../config/constants";

export interface IAuditReport {
  project: mongoose.Types.ObjectId;
  auditor?: mongoose.Types.ObjectId;
  isAiGenerated: boolean;
  manualReviewNotes?: string;
  evidence: {
    url: string;
    type: string;
    caption?: string;
  }[];
  riskReasons: string[];
  recommendation: string;
  pdfUrl?: string;
  status: AuditStatus;
  aiResult?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AuditReportSchema = new Schema<IAuditReport>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    auditor: { type: Schema.Types.ObjectId, ref: "User" },
    isAiGenerated: { type: Boolean, default: true },
    manualReviewNotes: String,
    evidence: [
      {
        url: String,
        type: String,
        caption: String
      }
    ],
    riskReasons: { type: [String], default: [] },
    recommendation: { type: String, default: "" },
    pdfUrl: String,
    status: { type: String, enum: Object.values(AuditStatus), default: AuditStatus.AI_GENERATED },
    aiResult: { type: Schema.Types.ObjectId, ref: "AiResult" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

AuditReportSchema.index({ project: 1, status: 1 });

export const AuditReportModel = mongoose.model<IAuditReport>("AuditReport", AuditReportSchema);
