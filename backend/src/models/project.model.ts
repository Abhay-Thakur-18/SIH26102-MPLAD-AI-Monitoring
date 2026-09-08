import mongoose, { Schema } from "mongoose";
import { AiStatus, AuditStatus, ProjectStatus } from "../config/constants";

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IMilestone {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  dueDate: Date;
  completedAt?: Date;
  budgetAllocated: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  evidenceUrls: string[];
}

export interface IProject {
  projectCode: string;
  title: string;
  description: string;
  mp: mongoose.Types.ObjectId;
  contractor?: mongoose.Types.ObjectId;
  district: string;
  state: string;
  village: string;
  location: IGeoPoint;
  budgetSanctioned: number;
  budgetUtilized: number;
  startDate: Date;
  endDate: Date;
  milestones: IMilestone[];
  status: ProjectStatus;
  progressPercent: number;
  completionPercent: number;
  riskScore: number;
  geoImages: string[];
  satelliteVerification?: {
    verified: boolean;
    score: number;
    lastCheckedAt?: Date;
    notes?: string;
  };
  aiStatus: AiStatus;
  auditStatus: AuditStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    completedAt: Date,
    budgetAllocated: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"],
      default: "PENDING"
    },
    evidenceUrls: { type: [String], default: [] }
  },
  { _id: true }
);

const ProjectSchema = new Schema<IProject>(
  {
    projectCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mp: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contractor: { type: Schema.Types.ObjectId, ref: "Contractor" },
    district: { type: String, required: true },
    state: { type: String, required: true },
    village: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    budgetSanctioned: { type: Number, required: true, min: 0 },
    budgetUtilized: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    milestones: { type: [MilestoneSchema], default: [] },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.DRAFT },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    geoImages: { type: [String], default: [] },
    satelliteVerification: {
      verified: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      lastCheckedAt: Date,
      notes: String
    },
    aiStatus: { type: String, enum: Object.values(AiStatus), default: AiStatus.NOT_STARTED },
    auditStatus: { type: String, enum: Object.values(AuditStatus), default: AuditStatus.NOT_STARTED },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

ProjectSchema.index({ location: "2dsphere" });
ProjectSchema.index({ district: 1, state: 1, status: 1 });
ProjectSchema.index({ mp: 1, isDeleted: 1 });
ProjectSchema.index({ title: "text", description: "text" });

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
