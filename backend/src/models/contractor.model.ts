import mongoose, { Schema } from "mongoose";
import { RiskLevel } from "../config/constants";

export interface IContractor {
  user?: mongoose.Types.ObjectId;
  organization: string;
  pan: string;
  gst: string;
  district: string;
  state: string;
  integrityScore: number;
  performanceScore: number;
  riskLevel: RiskLevel;
  pastProjects: mongoose.Types.ObjectId[];
  fraudHistory: {
    description: string;
    occurredAt: Date;
    severity: RiskLevel;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContractorSchema = new Schema<IContractor>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    organization: { type: String, required: true },
    pan: { type: String, required: true, unique: true, uppercase: true },
    gst: { type: String, required: true, unique: true, uppercase: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    integrityScore: { type: Number, default: 70, min: 0, max: 100 },
    performanceScore: { type: Number, default: 70, min: 0, max: 100 },
    riskLevel: { type: String, enum: Object.values(RiskLevel), default: RiskLevel.MEDIUM },
    pastProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    fraudHistory: [
      {
        description: String,
        occurredAt: Date,
        severity: { type: String, enum: Object.values(RiskLevel) }
      }
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

export const ContractorModel = mongoose.model<IContractor>("Contractor", ContractorSchema);
