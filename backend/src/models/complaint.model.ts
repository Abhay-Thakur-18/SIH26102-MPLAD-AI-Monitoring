import mongoose, { Schema } from "mongoose";
import { ComplaintStatus } from "../config/constants";

export interface IComplaint {
  complainant: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  photoUrls: string[];
  videoUrls: string[];
  voiceUrl?: string;
  status: ComplaintStatus;
  aiMatchResult?: {
    matchedProject?: mongoose.Types.ObjectId;
    similarity: number;
    explanation: string;
  };
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complainant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    photoUrls: { type: [String], default: [] },
    videoUrls: { type: [String], default: [] },
    voiceUrl: String,
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.SUBMITTED },
    aiMatchResult: {
      matchedProject: { type: Schema.Types.ObjectId, ref: "Project" },
      similarity: Number,
      explanation: String
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

ComplaintSchema.index({ location: "2dsphere" });
ComplaintSchema.index({ complainant: 1, status: 1 });

export const ComplaintModel = mongoose.model<IComplaint>("Complaint", ComplaintSchema);
